const express = require("express");

const cors = require("cors");

const server = express();

const multer = require('multer');

const xlsx = require('xlsx');

const fs = require('fs');

const util = require('util');

const { exec } = require('child_process');

const path = require('path');

const upload = multer({ storage: multer.memoryStorage() });

const PORT = process.env.PORT || 7781;

const nodemailer = require("nodemailer");

const dotenv = require('dotenv')

const bcrypt = require('bcryptjs');

dotenv.config()

server.use(cors());

server.use(express.json({ limit: '100mb' }));
server.use(express.urlencoded({ limit: '100mb', extended: true }));



const readFile = util.promisify(fs.readFile);

const writeFile = util.promisify(fs.writeFile);

const printerSharePath = process.env.PRINTER_SHARE_PATH;

const printerDeviceName = process.env.PRINTER_DEVICE_NAME;

console.log(printerSharePath, " ", printerDeviceName);


const db = require('./db');
const { Module } = require("module");
const { log } = require("console");
// const db4Logs = require('./db4Logs');

db.connect().then(() => {
  console.log('Connected to the database');
}).catch(err => {
  console.error('Database connection failed:', err);

  logErrorToFile('Database connection failed:', err)
});



server.get('/', async (req, res) => {
  try {
    res.json('ERP_APP Tracker API On Live ')
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal Server Error ')
  }
});


/// login

server.post('/login', async (req, res) => {
  try {
    const { username, password, ipAddress } = req.body;
    console.log(req.body)
    const query = `exec dbo.userlogin '${username}'`;

    const response = await db.query(query);

    const user = response.recordset[0];


    const Pagedata = response.recordsets[1]
    console.log(Pagedata);
    if (user.Result === 404) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    let loginattemptCount = user.loginattempt

    const isMatch = await bcrypt.compare(password, user.password); // this user password db password check true or false

    // if (user.UserStatus.toLowerCase() !== 'sa' && loginattemptCount >= 3) {

    //   res.status(400).json({ error: 'Your Password is locked, Please wait for Administrative Approval' });

    //   const status = 'pl'

    //   await sendPasswordEmail(username, user.email, user.employeename, password, status, user.branchid);

    //   return

    // } 
    // else {

    if (!isMatch) {   /// password match check

      // loginattemptCount++

      // if (user.UserStatus.toLowerCase() !== 'sa') {

      const query = `update UserMainMaster set loginattempt = ${loginattemptCount} where employeecode = '${username}'`
      const response = await db.query(query)

      // }

      return res.status(400).json({ error: `Invalid credentials Attempt` });

    } else {

      const query = `sp_loginhistory '${username}','${user.employeename}','login','${ipAddress}','${'I'}','${user.branchid}'`

      const response = await db.query(query)

      if (response.rowsAffected) {
        const send = { ...user, usercode: username, password }

        const formattedData = Pagedata.reduce((acc, item) => {
          acc[item.Screenid] = item.status;
          return acc;
        }, {});

        res.status(200).json({ send, pagedata: formattedData || null, message: "Login Successfully", navigation: Pagedata || null });

      }

    }
    // }



  } catch (err) {

    console.error(err);
    logErrorToFile(err)
  }
})


server.post('/loginhistory', async (req, res) => {
  try {
    const { usercode,
      username,
      status,
      ipAddress,
      mood,
      branchid } = req.body

    const query = `sp_loginhistory '${usercode}','${username}','${status}','${ipAddress}','${mood}','${branchid}'`

    const response = await db.query(query)

    res.status(200).send(response.recordset)

  } catch (error) {
    console.error(error);
    logErrorToFile(error)
  }
})


server.post('/changepassword', async (req, res) => {

  try {
    const { usercode, oldpassword, newpassword, confirmpassword } = req.body


    const query = `SELECT ISNULL((SELECT password FROM UserMainMaster WITH (NOLOCK) WHERE employeecode = '${usercode}'), CAST(0 AS int)) AS password`


    const response = await db.query(query)

    const data = response.recordset[0]


    if (data.password === '0') {
      console.log('User code not found');
      return res.status(404).json({ error: 'User code not found' });

    }

    const isMatch = await bcrypt.compare(oldpassword, data.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Old Password Not Match' });
    }

    if (isMatch) {

      const hashedPassword = await bcrypt.hash(confirmpassword, 10)  /// encrypt password

      const query = `update UserMainMaster set temppassword = '${hashedPassword}',password = '${hashedPassword}',firstlogin = '${0}',expireddate = getdate() where employeecode = '${usercode}'`

      const response = await db.query(query)

      if (response.rowsAffected) {

        res.json({ message: 'Password Changed Successfully' })
      }

    }

  } catch (err) {

    console.error(err);
    logErrorToFile(err)
  }

})


server.post('/ResetPassword', async (req, res) => {
  try {

    const { id, employeecode, employeename, email, branchid } = req.body

    // const generatePassword = (length) => {
    //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //   let password = '';
    //   for (let i = 0; i < length; i++) {
    //     password += chars.charAt(Math.floor(Math.random() * chars.length));
    //   }
    //   return password;
    // };

    // const temppassword = generatePassword(8);
    const temppassword = 'Arosak@123';
    const hashedPassword = await bcrypt.hash(temppassword, 10)  /// encrypt password

    const query = `update UserMainMaster set temppassword = '${hashedPassword}',password = '${hashedPassword}',firstlogin = '${1}',expireddate = getdate() where empid =${id}`

    const response = await db.query(query)

    if (response.rowsAffected) {

      res.status(200).send()

      const status = 're'

      await sendPasswordEmail(employeecode, email, employeename, temppassword, status, branchid);
    }


  } catch (error) {

    console.error(error);
    logErrorToFile(error)
  }
})


server.post('/forgotpassword', async (req, res) => {
  try {

    const { usercode, dateofjoin, email } = req.body

    const query = `select COUNT(*)as count from UserMainMaster where employeecode= '${usercode}' and DateofJoining = cast('${dateofjoin}' as date) and 
    email = '${email}'`

    const response = await db.query(query)

    console.log(response.recordset);

    if (response.recordset[0].count === 0) {

      res.status(400).json({ error: 'Please Check The Data' })
    } else {

      const Branchid = await db.query(`SELECT branchid,employeename FROM UserMainMaster WHERE employeecode = '${usercode}'
                      AND DateofJoining = CAST('${dateofjoin}' AS DATE)  AND email = '${email}'`)

      const branchid = Branchid.recordset[0].branchid


      // const generatePassword = (length) => {
      //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      //   let password = '';
      //   for (let i = 0; i < length; i++) {
      //     password += chars.charAt(Math.floor(Math.random() * chars.length));
      //   }
      //   return password;
      // };

      // const temppassword = generatePassword(8);

      const temppassword = 'Arosak@123';
      const hashedPassword = await bcrypt.hash(temppassword, 10)  /// encrypt password

      const query = `update UserMainMaster set temppassword = '${hashedPassword}',password = '${hashedPassword}',firstlogin = '${1}' where employeecode ='${usercode}'`

      const response = await db.query(query)

      if (response.rowsAffected) {

        const status = 're'

        const employeename = Branchid.recordset[0].employeename

        await sendPasswordEmail(usercode, email, employeename, temppassword, status, branchid);

        res.status(200).json({ message: 'Password Forgot Success' })
      }


    }

  } catch (error) {

    console.error(error);
    logErrorToFile(error)
  }
})


server.post('/ExpirePasswordRest', async (req, res) => {
  try {

    const { usercode, oldpassword, newpassword, confirmpassword } = req.body


    const query = `SELECT ISNULL((SELECT password FROM UserMainMaster WITH (NOLOCK) WHERE employeecode = '${usercode}'), CAST(0 AS int)) AS password;`

    const response = await db.query(query)

    const data = response.recordset[0]


    if (data.password === '0') {
      console.log('User code not found');
      return res.status(404).json({ error: 'User code not found' });
    }

    const isMatch = await bcrypt.compare(oldpassword, data.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Old Password Not Match' });
    }

    if (isMatch) {

      const hashedPassword = await bcrypt.hash(confirmpassword, 10)  /// encrypt password

      const query = `update UserMainMaster set temppassword = '${hashedPassword}',password = '${hashedPassword}',firstlogin = '${0}',expireddate = getdate() where employeecode = '${usercode}'`

      const response = await db.query(query)

      if (response.rowsAffected) {

        res.json({ message: 'Password Reseted Successfully' })
      }

    }


  } catch (error) {

    console.error(error);
    logErrorToFile(error)
  }
})

/// user Role Master start

server.post('/UserroleMaster', async (req, res) => {
  try {

    const { id, userrole, createdby, updateby, branchid, mode } = req.body

    const query = `exec sp_Userrolemaster '${id}','${userrole}','${createdby}','${updateby}','${branchid}','${mode}'`

    const response = await db.query(query)

    res.status(200).send(response.recordset)

  } catch (err) {
    console.error(err);
    logErrorToFile(err)
    res.status(500).json('Internal Server Error ')
  }
});

/// user Role Master End

server.post('/DepartmentMaster', async (req, res) => {
  try {

    const { id, departmentname, createdby, updateby, branchid, mode } = req.body

    const query = `exec sp_Userdepartmentmaster '${id}','${departmentname}','${createdby}','${updateby}','${branchid}','${mode}'`

    console.log(query);

    const response = await db.query(query)

    res.status(200).send(response.recordset)

  } catch (err) {
    console.error(err);
    logErrorToFile(err)
    res.status(500).json('Internal Server Error ')
  }
});



server.post('/UserMainmasterRegister', async (req, res) => {
  try {

    const { id, createdby, updateby, branchid, mode, employeecode, employeename, email, dateofjoin, UserStatus, userrole, department } = req.body;


    const trimString = (value) => {
      return typeof value === 'string' ? value.trim() : value;
    };

    const trimedemployeecode = trimString(employeecode);
    const trimedemployeename = trimString(employeename);
    const trimedemail = trimString(email);


    // const generatePassword = (length) => {
    //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //   let password = '';
    //   for (let i = 0; i < length; i++) {
    //     password += chars.charAt(Math.floor(Math.random() * chars.length));
    //   }
    //   return password;
    // };

    // const temppassword = generatePassword(8);
    const temppassword = 'Arosak@123';
    const hashedPassword = await bcrypt.hash(temppassword, 10)  /// encrypt password


    const InsertQuery = `exec sp_UserMainMaster '${id}','${trimedemployeecode}', '${trimedemployeename}', '${trimedemail}', '${hashedPassword}', '${hashedPassword}', 
        '${dateofjoin}', ${UserStatus}, ${userrole}, ${department},${createdby},'${updateby}',${branchid},'${mode}'`;

    console.log(InsertQuery);

    const response = await db.query(InsertQuery)

    console.log(response.rowsAffected);

    if (response.rowsAffected) {

      const status = 'ur'

      // await sendPasswordEmail(employeecode, trimedemail, trimedemployeename, temppassword, status, branchid);

      res.status(200).json({ message: 'User registration successful. your Temp Password is Arosak@123.' });

    }
    else {
      res.status(500).json('User registration failed.');
    }


  } catch (error) {
    res.status(500).send("An error occurred while processing your request.");
    console.error(error);
    logErrorToFile(error)
  }
})


server.post('/userMainMasterSelect', async (req, res) => {
  try {

    const { id, updateby, branchid, mode } = req.body

    const Query = `exec sp_UserMainMaster '${id}','', '', '', '', '','', '', 0,0,0,'${updateby}',${branchid},'${mode}'`;

    console.log(Query);


    const response = await db.query(Query)

    res.status(200).send(response.recordset);


  } catch (error) {
    console.error(error);
    logErrorToFile(error)
    res.status(500).send("An error occurred while processing your request.");
  }
});


server.post('/userMainMasterUpdate', async (req, res) => {
  try {

    const { updateddby, mode, id, employeecode, employeename, email, dateofjoin, UserStatus, userrole, department } = req.body

    const Query = `exec sp_UserMainMaster '${id}','${employeecode}', '${employeename}', '${email}', '', '','${dateofjoin}', '${UserStatus}','${userrole}',
   '${department}', 0,'${updateddby}',0,'${mode}'`;

    console.log(Query);

    const response = await db.query(Query)

    res.status(200).send(response.rowsAffected);


  } catch (error) {
    console.error(error);
    logErrorToFile(error)
    res.status(500).send("An error occurred while processing your request.");
  }
});



async function sendPasswordEmail(employeecode, email, employeename, password, status, branchid) {
  try {

    const response = await db.query(`SELECT * FROM EmailSendContent where status = '${status}'`)

    const maildata = await response.recordset[0]

    const Frommail = await db.query(`select * FROM EmailConfig where branchid = ${branchid}`)

    const frommdaildata = await Frommail.recordset[0]


    let smtpTransport = nodemailer.createTransport({
      service: `${frommdaildata.ServiceName}`,
      host: `${frommdaildata.HostName}`,
      port: `${frommdaildata.PortNo}`,
      secure: false,
      auth: {
        user: `${frommdaildata.frommail}`,
        pass: `${frommdaildata.apppassword}`,
      },
    });

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Created</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          .title { color: #333; font-size: 20px; margin-bottom: 20px; }
          .content { font-size: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="title">${maildata.bodyHead}</h2>
          <p class="content">${maildata.bodyContent1} ${employeename},</p>
          <p class="content">${maildata.bodyContent2}</p>
           
          <p class="content"><strong>${maildata.bodymain1} ${employeecode}</strong></p>
          <p class="content"><strong>${maildata.bodymain2} ${password}</strong></p>


          <p class="content">${maildata.bodyFooter1}</p>
          <p class="content">${maildata.bodyFooter}<br/>Granules</p>
        </div>
      </body>
      </html>
    `;


    await smtpTransport.sendMail({
      from: `${frommdaildata.frommail}`,
      to: email,
      subject: `${maildata.subject}`,
      html: emailContent,
    });

    console.log("Email sent successfully.");
  } catch (error) {
    console.error('Error sending email:', error);
    logErrorToFile('Error sending email:', error)
  }
}


// server.post('/RoleMapping', async (req, res) => {
//   try {
//       const { pageid, roleid, createby, mood, branchid } = req.body;
//       console.log(pageid, roleid, createby, mood);

//       if (pageid !== '') {
//           for (const data of pageid) {
//               if (data.status === 'a') {
//                   console.log('role insert comes');
//                   const query = `exec sp_RoleMapping '${data.Screenid}','${roleid}','${createby}','${mood}','${branchid}'`;
//                   console.log(query);
                  
//                   const response = await db.query(query);
//                   console.log(response);
//               } else {
//                   console.log('role delete comes');
//                   const deletemood = 'D';
//                   const query = `exec sp_RoleMapping '${data.Screenid}','${roleid}','${createby}','${deletemood}','${branchid}'`;
//                   console.log(query);
                  
//                   const response = await db.query(query);
//                   console.log(response);
//               }
//           }
//           res.status(200).json('success Page Assigned');
//       } else {
//           const query = `exec sp_RoleMapping '${pageid}','${roleid}','${createby}','${mood}','${branchid}'`;
//           console.log(query);
          
//           const response = await db.query(query);
//           console.log(response);
//           res.status(200).send(response);
//       }
//   } catch (error) {
//       console.log(error);
//       logErrorToFile(error);
//   }
// });

server.post('/RoleMapping', async (req, res) =>  {
  try {
      const { pageid, roleid, createby, mood, branchid } = req.body;
      console.log(pageid, roleid, createby, mood);
      if (pageid !== '') {
          for (const data of pageid) {
              if (data.status === 'a') {
                  console.log('role insert comes');
                  const query = `exec sp_RoleMapping '${data.Screenid}','${roleid}','${createby}','${mood}','${branchid}'`;
                  console.log(query);
                  const response = await db.query(query);
                  console.log(response);
              }
              else {
                  console.log('role delete comes');
                  const deletemood = 'D';
                  const query = `exec sp_RoleMapping '${data.Screenid}','${roleid}','${createby}','${deletemood}','${branchid}'`;
                  console.log(query);
                  const response = await db.query(query);
                  console.log(response);
              }
          }
          res.status(200).json('success Page Assgined');
      }
      else {
          const query = `exec sp_RoleMapping '${pageid}','${roleid}','${createby}','${mood}','${branchid}'`;
          console.log(query);
          const response = await db.query(query);
          res.status(200).send(response.recordset);
          console.log(response);   
          
          
      }
  }
  catch (error) {
      console.log(error);
      logErrorToFile(error);
  }
});

server.post('/UserUploadData', upload.single('file'), async (req, res) => {

  try {
    const file = req.file;

    const { createdby, systemip, branchid } = req.body; // Extract additional fields

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    let uploadcount = 0

    const unuploadedData = [];

    const id = ''

    const mood = 'I'

    const UserStatus = 'A'


    for (const row of data) {
      const { Employeecode, Employeename, Email, DateofJoining, Userrole } = row;


      const trimString = (value) => {
        return typeof value === 'string' ? value.trim() : value;
      };

      // Corrected variable names
      const trimmedEmployeecode = trimString(Employeecode);
      const trimmedEmployeename = trimString(Employeename);
      const trimmedEmail = trimString(Email);
      const trimmedUserrole = trimString(Userrole);
      // const trimmedDepartmentname = trimString(Departmentname);


      const convertExcelDateToJSDate = (excelSerialDate) => {
        const baseDate = new Date('1900-01-01');
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const daysOffset = excelSerialDate - 1;
        const totalMilliseconds = daysOffset * millisecondsPerDay;
        const resultDate = new Date(baseDate.getTime() + totalMilliseconds);
        resultDate.setHours(0, 0, 0, 0);
        return resultDate;
      };


      const originaldateformate = (date) => {
        return convertExcelDateToJSDate(date).toISOString().split('T')[0];
      }


      let originalDateofJoining = DateofJoining && DateofJoining !== undefined ? originaldateformate(DateofJoining) : undefined



      const query = `exec sp_UploadUser '${trimmedEmployeecode}','${trimmedEmployeename}','${trimmedEmail}','${trimmedUserrole}','${branchid}'`


      const response = await db.query(query)

      const [data] = response.recordset


      console.log(data);


      if (data.Count === 0 && data.useroleid !== 0) {



        // const generatePassword = (length) => {
        //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        //   let password = '';
        //   for (let i = 0; i < length; i++) {
        //     password += chars.charAt(Math.floor(Math.random() * chars.length));
        //   }
        //   return password;
        // };

        const temppassword = "Arosak@123";

        const hashedPassword = await bcrypt.hash(temppassword, 10)  /// encrypt password


        const InsertQuery = `exec sp_UserMainMaster '${id}','${trimmedEmployeecode}', '${trimmedEmployeename}', '${trimmedEmail}', '${hashedPassword}', '${hashedPassword}', 
            '${originalDateofJoining}', ${UserStatus}, ${data.useroleid},${createdby},'',${branchid},'${mood}'`;

        const response = await db.query(InsertQuery)


        if (response.rowsAffected[0] !== 0) {
          uploadcount++
          const status = 'ur'
          // await sendPasswordEmail(trimmedEmployeecode, trimmedEmail, trimmedEmployeename, temppassword, status, branchid);
        }

      } else {
        unuploadedData.push({
          Employeecode: row.Employeecode, Employeename: row.Employeename, Email: row.Email,
          DateofJoining: originalDateofJoining, Userrole: row.Userrole
        });

      }

    }


    if (unuploadedData.length > 0) {

      const unuploadedWorkbook = xlsx.utils.book_new();
      const unuploadedWorksheet = xlsx.utils.json_to_sheet(unuploadedData);
      xlsx.utils.book_append_sheet(unuploadedWorkbook, unuploadedWorksheet, 'Unuploaded User Data');

      const unuploadedFilePath = path.join(__dirname, 'unuploaded_User_data.xlsx');

      xlsx.writeFile(unuploadedWorkbook, unuploadedFilePath);

      res.status(200).json({
        message: 'Data uploaded with some errors',
        uploadcount,
        unuploadedFilePath: `/download/unuploaded_User_data.xlsx`,
      });

    } else {
      res.status(200).json({ message: 'Data uploaded successfully', uploadcount });
    }



    //res.status(200).json({ message: 'Data uploaded successfully', uploadcount });
  } catch (err) {
    logErrorToFile(err)
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



server.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.log('Error downloading file:', err);
      res.status(500).json({ message: 'Error downloading file' });
    } else {
      fs.unlinkSync(filePath); // Clean up the file after download
    }

  });
});



server.get('/user/ip', (req, res) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

  console.log(ipAddress);
  res.json({ ip: ipAddress });
});



//// Dashborad Notification 

server.post('/Notification', async (req, res) => {
  try {

    const { id, mood, branchid } = req.body

    const query = `exec dbo.sp_Notification '${id}','${mood}','${branchid}'`

    const response = await db.query(query)

    const count = response.recordsets[0][0].loginAttemptCount

    const PasswordAlertData = response.recordsets[1]

    res.status(200).json({ count, PasswordAlertData })

  } catch (error) {
    logErrorToFile(error)
    console.log(error);
  }
})


/// Dashboard Count

server.post('/DashboradDatas', async (req, res) => {
  try {
    const { branchid } = req.query;
    const query = `exec sp_DashboardCount '${branchid}'`;
    const response = await db.query(query);

    const Topcard = response.recordsets[0][0];
    const firstCardChart = response.recordsets[1][0];
    const SecondCardChart = response.recordsets[2][0];
    const ThirdCardChart = response.recordsets[3][0];
    const FourthCardChart = response.recordsets[4][0];
    const AuthorizedgridData = response.recordsets[5];

    res.status(200).json({ Topcard, firstCardChart, SecondCardChart, ThirdCardChart, FourthCardChart, AuthorizedgridData });
  } catch (error) {
    logErrorToFile(error); // Ensure this function is defined to log errors
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


server.post('/DashbordModelData', async (req, res) => {
  try {

    const { mood, branchid } = req.body

    const query = `exec DashbordModelData '${mood}',${branchid}`

    console.log(query);

    const response = await db.query(query)

    res.status(200).send(response.recordset)

  } catch (error) {
    logErrorToFile(error)
    console.log(error);
  }
})




// BRANCHMASTER 

server.post('/BranchMaster', async (req, res) => {
  try {

    const { id, branchName, createdby, updateby, mood } = req.body

    const quary = `exec sp_BranchMaster '${id}','${branchName}','${createdby}','${updateby}','${mood}'`

    const response = await db.query(quary)

    res.status(200).send(response.recordset)

  } catch (error) {

    logErrorToFile(error)
    console.log(error);
  }
})


/// Settings

server.post('/emailconfigsettings', async (req, res) => {
  try {

    const { id, frommail, apppassword, ServiceName, HostName, PortNumber, createdby, updateby, branchid, mode } = req.body

    const query = `exec SP_EMAILCONFIG '${id}','${frommail}','${apppassword}','${ServiceName}','${HostName}','${PortNumber}','${createdby}','${updateby}','${branchid}','${mode}'`


    console.log(query);

    const response = await db.query(query)

    res.status(200).send(response.recordset)

  } catch (error) {

    logErrorToFile(error)
    console.log(error);
  }
})


server.post('/othersetting', async (req, res) => {
  try {

    const { id, passwordexpireday, autologouttime, createdby, branchid, mode } = req.body

    const query = `EXEC SP_GeneralSetting '${id}','${passwordexpireday}','${autologouttime}','${createdby}','${branchid}','${mode}'`

    const response = await db.query(query)

    res.status(200).send(response.recordset)

  } catch (error) {

    logErrorToFile(error)
    console.log(error);
  }
})


// Master Screen

  // Customer
  server.post('/Customer', async (req, res) => {
    try {

      const { id, CustomerCode, CustomerName, Address, Pincode, DistanceinKms,
        State, ContactPerson, PhoneNo, MobileNo, EmailID, GST, GSTIN, CreditDays,
        PAN, TCS, VendorCode, created_user, Status, mode, branchid } = req.body;

      // Ensure all required parameters are included
      const query = `EXEC Masters.SP_Customer @Cus_ID = '${id}',
                    @CustomerCode='${CustomerCode}', @CustomerName='${CustomerName}', @Address='${Address}', @Pincode='${Pincode}', 
                    @DistanceinKms='${DistanceinKms}', @State='${State}', @ContactPerson='${ContactPerson}', @PhoneNo='${PhoneNo}', 
                    @MobileNo='${MobileNo}', @EmailID='${EmailID}', @GST='${GST}', @GSTIN='${GSTIN}', 
                    @CreditDays='${CreditDays}', @PAN='${PAN}', @TCS='${TCS}', @VendorCode='${VendorCode}', 
                    @created_user = '${created_user}', @Status='${Status}', @mode='${mode}', @branchid='${branchid}'`;
      const response = await db.query(query)
      console.log("created data", query)
      // console.log("created data", response)
      res.status(200).send(response.recordset)

    } catch (error) {

      logErrorToFile(error)
      console.log(error);
    }
  })

  // Supplier
  server.post('/Supplier', async (req, res) => {
    try {

      const { id, SupplierCode, SupplierName, Address, State, Category,
        GSTIN, PAN, TCS, GSTType, Commodity, ISOCertified, ShelfLife, Period,
        ContactPerson, PhoneNo, MobileNo, EmailID, PaymentTerms, Freight, Notes,
        created_user, Status, mode, branchid } = req.body;

      // Ensure all required parameters are included
      const query = `EXEC Masters.SP_Supplier @Sup_ID = '${id}',
                    @SupplierCode='${SupplierCode}', @SupplierName='${SupplierName}', @Address='${Address}', @State='${State}', 
                    @Category='${Category}', @ContactPerson='${ContactPerson}', @PhoneNo='${PhoneNo}', @MobileNo='${MobileNo}', 
                    @EmailID='${EmailID}', @GSTIN='${GSTIN}', @PAN='${PAN}', @TCS='${TCS}', @GSTType='${GSTType}', @Commodity='${Commodity}', 
                    @ISOCertified='${ISOCertified}', @ShelfLife='${ShelfLife}', @Period='${Period}', 
                    @PaymentTerms='${PaymentTerms}', @Freight='${Freight}', @Notes='${Notes}',
                    @created_user = '${created_user}', @Status='${Status}', @mode='${mode}', @branchid='${branchid}'`;
      const response = await db.query(query)
      console.log("created data", query)
      // console.log("created data", response)
      res.status(200).send(response.recordset)

    } catch (error) {

      logErrorToFile(error)
      console.log(error);
    }
  })

  // Product
  server.post('/Product', upload.single('PDFFile'), async (req, res) => {
    try {
      // console.log(req.body); // Log the body
      // console.log(req.files); // Log the files

      const { id, PartCode, Description, HSNCode, OPStock, Model,
        BatchQty, CycleTime, GSTSlab, Tax, DwgNo, Rev, Date,
        QuotationRef, MinQty, MaxQty, created_user, Status, mode, branchid } = req.body;

      // Check for the PDF file
      const pdfFile = req.file ? req.file.buffer.toString('base64') : null;


      const query = `EXEC Masters.SP_Product @Prod_ID='${id}', @PartCode='${PartCode}', @Description='${Description}', @HSNCode='${HSNCode}', @OPStock='${OPStock}',
       @Model='${Model}', @BatchQty='${BatchQty}', @CycleTime='${CycleTime}', @GSTSlab='${GSTSlab}', 
       @Tax='${Tax}', @DwgNo='${DwgNo}', @Rev='${Rev}', @Date='${Date}', @QuotationRef='${QuotationRef}',
        @MinQty='${MinQty}', @MaxQty='${MaxQty}',  @PDFFile='${pdfFile}' , 
        @created_user='${created_user}', @Status='${Status}', @mode='${mode}', @branchid='${branchid}'`;

      const response = await db.query(query);
      console.log("Created data", query);
      res.status(200).send(response.recordset);

    } catch (error) {
      logErrorToFile(error);
      console.log(error);
      res.status(500).send('An error occurred');
    }
  });


  // Raw Material
  server.post('/RawMaterial', async (req, res) => {
    try {
      const { id, PartNo, Description, Unit, Location, Balance, PackingStandard,
        HSNCode, Purchaser, MinStock, MaxStock, Category, Vendor1, V1GST,
        V1Rate, Vendor2, V2GST, V2Rate, Vendor3, V3GST, V3Rate, created_user,
        Status, mode, branchid } = req.body;
        console.log("created data", req.body);
      // Ensure all required parameters are included
      const query = `EXEC Masters.SP_RawMaterial @RM_ID = '${id}', 
                    @PartNo='${PartNo}', @Description='${Description}', @Unit='${Unit}', 
                    @Location='${Location}', @Balance='${Balance}', 
                    @PackingStandard='${PackingStandard}', @HSNCode='${HSNCode}', 
                    @Purchaser='${Purchaser}', @MinStock='${MinStock}', 
                    @MaxStock='${MaxStock}', @Category='${Category}', 
                    @Vendor1='${Vendor1}', @V1GST='${V1GST}', @V1Rate='${V1Rate}', 
                    @Vendor2='${Vendor2}', @V2GST='${V2GST}', @V2Rate='${V2Rate}', 
                    @Vendor3='${Vendor3}', @V3GST='${V3GST}', @V3Rate='${V3Rate}', 
                    @created_user='${created_user}', @Status='${Status}', 
                    @mode='${mode}', @branchid='${branchid}'`;

      const response = await db.query(query);
      console.log("created data", query);
      // console.log("created data", response);
      if (response.rowsAffected[0] === 0) {
        return res.status(400).send('No rows affected');
      }
      res.status(200).send(response.recordset);

    } catch (error) {
      logErrorToFile(error);
      console.log(error);
      res.status(500).send('Server error');
    }
  });



// Supplier-FG Rate Mapping Master Start 
server.post('/Supplier_FGRateMapping', async (req, res) => {
  try {
    const { SupplierName, SupplierCode, PartNumber, Description, Price, branchid, CreatedBy } = req.body
    const mode = 'I'
    // console.log(req.body)
    const InserQuery = `EXEC Masters.SP_SupplierFGRateMapping '','${SupplierName}','${SupplierCode}','${PartNumber}','${Description}','${Price}','${branchid}','${CreatedBy}','${mode}',''`
    // console.log(InserQuery)
    const response = await db.query(InserQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log(err)
  }
})

server.get('/MappedSupplierDetails', async (req, res) => {
  try {
    const mode = 'S'
    const SelectQuery = `EXEC Masters.SP_SupplierFGRateMapping '','','','','','','','','${mode}',''`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })

  } catch (err) {
    console.log(err)
  }
})

server.post('/MappedDetailsIndividual', async (req, res) => {
  try {
    const { SFGRM_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_SupplierFGRateMapping '${SFGRM_ID}','','','','','','','','${mode}',''`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})

server.post('/UpdateSupplier_FGRateMapping', async (req, res) => {
  try {
    const { SFGRM_ID, SupplierName, SupplierCode, PartNumber, Description, Price, UpdatedBy, Status } = req.body
    const mode = 'U'
    const UpdateQuery = `EXEC Masters.SP_SupplierFGRateMapping '${SFGRM_ID}','${SupplierName}','${SupplierCode}','${PartNumber}','${Description}','${Price}','','${UpdatedBy}','${mode}','${Status}'`
    const response = await db.query(UpdateQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log(err)
  }
})

server.post('/InActive_Supplier_FGRateMapping', async (req, res) => {
  try {
    const { SFGRM_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_SupplierFGRateMapping '${SFGRM_ID}','','','','','','','','${mode}',''`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})

// Supplier FG Rate Mapping Upload

server.post('/SupplierFGRateMapping_Upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { CreatedBy, branchid } = req.body;
    const mode = 'I'
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    let uploadcount = 0;
    const unuploadedData = [];

    const convertExcelDateToJSDate = (excelSerialDate) => {
      if (isNaN(excelSerialDate)) {
        return null; // Return null if input is not a number
      }
      const baseDate = new Date('1900-01-01');
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysOffset = excelSerialDate - 1;
      const totalMilliseconds = daysOffset * millisecondsPerDay;
      const resultDate = new Date(baseDate.getTime() + totalMilliseconds);
      resultDate.setHours(0, 0, 0, 0);
      return resultDate;
    };
    const originaldateformate = (date) => {
      const jsDate = convertExcelDateToJSDate(date);
      if (jsDate === null || isNaN(jsDate.getTime())) {
        return undefined; // Return undefined if date is invalid
      }
      return jsDate.toISOString().split('T')[0];
    };
    for (const row of data) {
      const {
        SupplierName, SupplierCode, PartNumber, Description, Price

      } = row;

      const trimString = (value) => typeof value === 'string' ? value.trim() : value;
      const trimmedSupplierName = trimString(SupplierName);
      const trimmedSSupplierCode = trimString(SupplierCode);
      const trimmedPartNumber = trimString(PartNumber);
      const trimmedDescription = trimString(Description);
      const trimmedPrice = trimString(Price);
      const InsertSFGRM_query = ` EXEC Masters.SP_SupplierFGRateMapping '','${trimmedSupplierName}','${trimmedSSupplierCode}','${trimmedPartNumber}','${trimmedDescription}','${trimmedPrice}','${branchid}','${CreatedBy}','${mode}',''`;
      const response1 = await db.query(InsertSFGRM_query)
      if (response1.rowsAffected && response1.rowsAffected[0] > 0) {
        uploadcount++;
      } else {
        unuploadedData.push({
          SupplierName: row.SupplierName, SupplierCode: row.SupplierCode, PartNumber: row.PartNumber, Description: row.Description, Price: row.Price
        });
      }
    }
    if (unuploadedData.length > 0) {
      const unuploadedWorkbook = xlsx.utils.book_new();
      const unuploadedWorksheet = xlsx.utils.json_to_sheet(unuploadedData);
      xlsx.utils.book_append_sheet(unuploadedWorkbook, unuploadedWorksheet, 'Unuploaded User Data');

      const unuploadedFilePath = path.join(__dirname, 'unuploaded_SFGRM_data.xlsx');
      xlsx.writeFile(unuploadedWorkbook, unuploadedFilePath);
      res.status(200).json({
        message: 'Data uploaded with some errors',
        uploadcount,
        unuploadedFilePath: `/unuploaded_SFGRM_data.xlsx`,
      });

    } else {
      res.status(200).json({ message: 'Data uploaded successfully', uploadcount });
    }

  } catch (err) {
    logErrorToFile(err.message);
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

server.get('/unuploaded_SFGRM_data.xlsx', (req, res) => {
  const filePath = path.join(__dirname, 'unuploaded_SFGRM_data.xlsx');
  res.download(filePath, 'unuploaded_SFGRM_data.xlsx', (err) => {
    if (err) {
      console.error('File download error:', err);
      res.status(500).send('Error downloading file.');
    }
  });
});


// FG Transfer Mapping Master Start
server.post('/FGTransferMapping', async (req, res) => {
  try {
    const { FromCode, ToCode, branchid, TransferedBy } = req.body
    const mode = 'I'
    const InsertQuery = `EXEC Masters.SP_FGTransferMapping '','${FromCode}','${ToCode}','${TransferedBy}','${branchid}','','','${mode}'`
    const response = await db.query(InsertQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log("error on FGTransferMappin Add", err)
  }
})

server.get('/FGTransferMappingSelect', async (req, res) => {
  try {
    const mode = 'S'
    const SelectQuery = `EXEC Masters.SP_FGTransferMapping '','','','','','','','${mode}'`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log("error on FGTransferMappin Add", err)
  }
})

server.post('/FGTransferMappingIndividual', async (req, res) => {
  try {
    const { FGTM_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_FGTransferMapping '${FGTM_ID}','','','','','','','${mode}'`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})

server.post('/Update_FGtransferMapping', async (req, res) => {
  try {
    const { FGTM_ID, FromCode, ToCode, Status, UpdateDatedBy } = req.body
    const mode = 'U'
    const UpdateQuery = `EXEC Masters.SP_FGTransferMapping '${FGTM_ID}','${FromCode}','${ToCode}','','','${UpdateDatedBy}','${Status}','${mode}'`
    const response = await db.query(UpdateQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log(err)
  }
})

server.post('/InActive_FGtransferMapping', async (req, res) => {
  try {
    const { FGTM_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_FGTransferMapping '${FGTM_ID}','','','','','','','${mode}'`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})


// RM Transfer Mapping Master Start
server.post('/RMTransferMapping', async (req, res) => {
  try {
    const { FromCode, ToCode, branchid, TransferedBy } = req.body
    const mode = 'I'
    const InsertQuery = `EXEC Masters.SP_RMTransferMapping '','${FromCode}','${ToCode}','${TransferedBy}','${branchid}','','','${mode}'`
    const response = await db.query(InsertQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log("error on FGTransferMappin Add", err)
  }
})


server.get('/RMTransferMappingSelect', async (req, res) => {
  try {
    const mode = 'S'
    const SelectQuery = `EXEC Masters.SP_RMTransferMapping '','','','','','','','${mode}'`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log("error on FGTransferMappin Add", err)
  }
})

server.post('/RMTransferMappingIndividual', async (req, res) => {
  try {
    const { RMTM_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_RMTransferMapping '${RMTM_ID}','','','','','','','${mode}'`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})

server.post('/Update_RMtransferMapping', async (req, res) => {
  try {
    const { RMTM_ID, FromCode, ToCode, Status, UpdateDatedBy } = req.body
    const mode = 'U'
    const UpdateQuery = `EXEC Masters.SP_RMTransferMapping '${RMTM_ID}','${FromCode}','${ToCode}','','','${UpdateDatedBy}','${Status}','${mode}'`
    const response = await db.query(UpdateQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log(err)
  }
})

server.post('/InActive_RMtransferMapping', async (req, res) => {
  try {
    const { RMTM_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_RMTransferMapping '${RMTM_ID}','','','','','','','${mode}'`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})

// Employee Master(Operator)
server.post('/AddOperator', async (req, res) => {
  try {
    const { CreatedBy, EmployeeRole, DateOfJoining, DateOfBirth, EmployeeName, PhoneNumber, Status, EmailID, EmployeeCode, UpdateDatedBy, FatherName, BloodGroup, aadharNumber, branchid } = req.body
    const mode = 'I';
    const InsertQuery = `EXEC Masters.SP_Operator '','${EmployeeCode}','${EmployeeName}','${aadharNumber}','${FatherName}','${BloodGroup}','${DateOfJoining}','${DateOfBirth}','${PhoneNumber}','${EmailID}','${Status}','${branchid}','${CreatedBy}','','${mode}'`
    const response = await db.query(InsertQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log("Error on Employee Master (Operator)", err)
  }
})

server.get('/fetchOperator', async (req, res) => {
  try {
    const mode = 'S'
    const SelectQuery = `EXEC Masters.SP_Operator '','','','','','','','','','','','','','','${mode}'`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })

  } catch (err) {
    console.log("error on Fech Operator", err)
  }
})

server.post('/OperatorDetailsIndividual', async (req, res) => {
  try {
    const { Ops_ID, mode } = req.body
    const SelectQuery = `EXEC Masters.SP_Operator '${Ops_ID}','','','','','','','','','','','','','','${mode}'`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })

  } catch (err) {
    console.log("error on Fetch Operator Details Individual", err)
  }
})

server.post('/UpdateOperator', async (req, res) => {
  try {
    const { Ops_ID, CreatedBy, EmployeeRole, DateOfJoining, DateOfBirth, EmployeeName, PhoneNumber, Status, EmailID, EmployeeCode, UpdateDatedBy, FatherName, BloodGroup, aadharNumber, branchid } = req.body
    const mode = 'U';
    // console.log(req.body)
    const UpdateQuery = `EXEC Masters.SP_Operator '${Ops_ID}','','${EmployeeName}','${aadharNumber}','${FatherName}','${BloodGroup}','${DateOfJoining}','${DateOfBirth}','${PhoneNumber}','${EmailID}','${Status}','${branchid}','${CreatedBy}','','${mode}'`
    const response = await db.query(UpdateQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log("Error on Employee Master (Operator)", err)
  }
})


server.post('/InActive_Operator', async (req, res) => {
  try {
    const { Ops_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.Sp_Operator '${Ops_ID}','','','','','','','','','','','','','','${mode}'`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})


// Upload Operator 
server.post('/Operator_Upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { CreatedBy, branchid } = req.body;
    const mode = 'I'
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    let uploadcount = 0;
    const unuploadedData = [];
    const convertExcelDateToJSDate = (excelSerialDate) => {
      const baseDate = new Date('1900-01-01');
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysOffset = excelSerialDate - 1;
      const totalMilliseconds = daysOffset * millisecondsPerDay;
      const resultDate = new Date(baseDate.getTime() + totalMilliseconds);
      resultDate.setHours(0, 0, 0, 0);
      return resultDate;
    };
    const originaldateformate = (date) => {
      return convertExcelDateToJSDate(date).toISOString().split('T')[0];
    }
    for (const row of data) {
      const { DateOfJoining, DateOfBirth, EmployeeName, PhoneNumber, EmailID, EmployeeCode, FatherName, BloodGroup, aadharNumber, Status } = row;
      console.log(row)
      const trimString = (value) => typeof value === 'string' ? value.trim() : value;
      const trimmedEmployeeName = trimString(EmployeeName);
      const trimmedPhoneNumber = trimString(PhoneNumber);
      const trimmedEmailID = trimString(EmailID);
      const trimmedEmployeeCode = trimString(EmployeeCode);
      const trimmedFatherName = trimString(FatherName);
      const trimmedBloodGroup = trimString(BloodGroup);
      const trimmedaadharNumber = trimString(aadharNumber);
      const trimmedStatus = trimString(Status);



      let originalDateofJoining = DateOfJoining && DateOfJoining !== undefined ? originaldateformate(DateOfJoining) : undefined
      let originalDateofBirth = DateOfBirth && DateOfBirth !== undefined ? originaldateformate(DateOfBirth) : undefined

      const InsertOperator_query = ` EXEC Masters.SP_Operator '','${trimmedEmployeeCode}','${trimmedEmployeeName}','${trimmedaadharNumber}','${trimmedFatherName}','${trimmedBloodGroup}','${originalDateofJoining}','${originalDateofBirth}','${trimmedPhoneNumber}','${trimmedEmailID}','${trimmedStatus}','${branchid}','${CreatedBy}','','${mode}'`;
      console.log(InsertOperator_query)
      const response1 = await db.query(InsertOperator_query)
      if (response1.rowsAffected && response1.rowsAffected[0] > 0) {
        uploadcount++;
      } else {
        unuploadedData.push({
          EmployeeCode: row.EmployeeCode, EmployeeName: row.EmployeeName,
          Status: row.Status, aadharNumber: row.aadharNumber, FatherName: row.FatherName,
          BloodGroup: row.BloodGroup, DateOfJoining: row.DateOfJoining,
          DateOfBirth: row.DateOfBirth, PhoneNumber: row.PhoneNumber, EmailID: row.EmailID,

        });
      }
    }
    if (unuploadedData.length > 0) {
      const unuploadedWorkbook = xlsx.utils.book_new();
      const unuploadedWorksheet = xlsx.utils.json_to_sheet(unuploadedData);
      xlsx.utils.book_append_sheet(unuploadedWorkbook, unuploadedWorksheet, 'Unuploaded Operator Data');

      const unuploadedFilePath = path.join(__dirname, 'unuploaded_Operator_data.xlsx');
      xlsx.writeFile(unuploadedWorkbook, unuploadedFilePath);
      res.status(200).json({
        message: 'Data uploaded with some errors',
        uploadcount,
        unuploadedFilePath: `/unuploaded_Operator_data.xlsx`,
      });

    } else {
      res.status(200).json({ message: 'Data uploaded successfully', uploadcount });
    }

  } catch (err) {
    logErrorToFile(err.message);
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


server.get('/unuploaded_Operator_data.xlsx', (req, res) => {
  const filePath = path.join(__dirname, 'unuploaded_SFGRM_data.xlsx');
  res.download(filePath, 'unuploaded_SFGRM_data.xlsx', (err) => {
    if (err) {
      console.error('File download error:', err);
      res.status(500).send('Error downloading file.');
    }
  });
});

// Machine Master
server.post('/AddMachine', async (req, res) => {
  try {
    const { MachineNo, MachineDetails, Tonnage, ShotSize, CreatedBy, branchid } = req.body
    const mode = 'I';
    const InsertQuery = `EXEC Masters.SP_Machine '','${MachineNo}','${MachineDetails}','${Tonnage}','${ShotSize}','','${branchid}','${CreatedBy}','','${mode}'`
    const response = await db.query(InsertQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log("Error on Machine Master ", err)
  }
})

server.get('/FetchMachine', async (req, res) => {
  try {
    const mode = 'S'
    const SelectQuery = `EXEC Masters.SP_Machine '','','','','','','','','','${mode}'`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })

  } catch (err) {
    console.log("error on Fech Operator", err)
  }
})

server.post('/MachineDetailsIndividual', async (req, res) => {
  try {
    const { Mac_ID, mode } = req.body
    const SelectQuery = `EXEC Masters.SP_Machine '${Mac_ID}','','','','','','','','','${mode}'`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })

  } catch (err) {
    console.log("error on Fetch Machine Details Individual", err)
  }
})

server.post('/UpdateMachine', async (req, res) => {
  try {
    const { Mac_ID, MachineNo, MachineDetails, Tonnage, ShotSize, Status, UpdatedBy } = req.body
    const mode = 'U';
    const UpdateQuery = `EXEC Masters.SP_Machine '${Mac_ID}','${MachineNo}','${MachineDetails}','${Tonnage}','${ShotSize}','${Status}','','','${UpdatedBy}','${mode}'`
    const response = await db.query(UpdateQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log("Error on Employee Master (Operator)", err)
  }
})

server.post('/InActive_Machine', async (req, res) => {
  try {
    const { Mac_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_Machine '${Mac_ID}','','','','','','','','','${mode}'`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})

// Upload Operator 
server.post('/Machine_Upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { CreatedBy, branchid } = req.body;
    const mode = 'Import'
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    let uploadcount = 0;
    const unuploadedData = [];
    const convertExcelDateToJSDate = (excelSerialDate) => {
      const baseDate = new Date('1900-01-01');
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysOffset = excelSerialDate - 1;
      const totalMilliseconds = daysOffset * millisecondsPerDay;
      const resultDate = new Date(baseDate.getTime() + totalMilliseconds);
      resultDate.setHours(0, 0, 0, 0);
      return resultDate;
    };
    const originaldateformate = (date) => {
      return convertExcelDateToJSDate(date).toISOString().split('T')[0];
    }
    for (const row of data) {
      const { MachineNo, MachineDetails, Tonnage, ShotSize, Status } = row;
      console.log(row)
      const trimString = (value) => typeof value === 'string' ? value.trim() : value;
      const trimmedMachineNo = trimString(MachineNo);
      const trimmedMachineDetails = trimString(MachineDetails);
      const trimmedTonnage = trimString(Tonnage);
      const trimmedShotSize = trimString(ShotSize);
      const trimmedStatus = trimString(Status);
      const InsertQuery = `EXEC Masters.SP_Machine '','${trimmedMachineNo}','${trimmedMachineDetails}','${trimmedTonnage}','${trimmedShotSize}','${trimmedStatus}','${branchid}','${CreatedBy}','','${mode}'`
      console.log(InsertQuery)
      const response1 = await db.query(InsertQuery)
      if (response1.rowsAffected && response1.rowsAffected[0] > 0) {
        uploadcount++;
      } else {
        unuploadedData.push({
          MachineNo: row.MachineNo, MachineDetails: row.MachineDetails, Tonnage: row.Tonnage,
          ShotSize: row.ShotSize, Status: row.Status
        });
      }
    }
    if (unuploadedData.length > 0) {
      const unuploadedWorkbook = xlsx.utils.book_new();
      const unuploadedWorksheet = xlsx.utils.json_to_sheet(unuploadedData);
      xlsx.utils.book_append_sheet(unuploadedWorkbook, unuploadedWorksheet, 'Unuploaded Machine Data');

      const unuploadedFilePath = path.join(__dirname, 'unuploaded_Machine_data.xlsx');
      xlsx.writeFile(unuploadedWorkbook, unuploadedFilePath);
      res.status(200).json({
        message: 'Data uploaded with some errors',
        uploadcount,
        unuploadedFilePath: `/unuploaded_Machine_data.xlsx`,
      });

    } else {
      res.status(200).json({ message: 'Data uploaded successfully', uploadcount });
    }

  } catch (err) {
    logErrorToFile(err.message);
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

server.get('/unuploaded_Machine_data.xlsx', (req, res) => {
  const filePath = path.join(__dirname, 'unuploaded_SFGRM_data.xlsx');
  res.download(filePath, 'unuploaded_SFGRM_data.xlsx', (err) => {
    if (err) {
      console.error('File download error:', err);
      res.status(500).send('Error downloading file.');
    }
  });
});



server.post('/GSTSlabs', async (req, res) => {

  try {

    const { GSTSlab, Tax, SGST, CGST, IGST, CreatedBy, branchid } = req.body;

    console.log(req.body)

    const mode = 'I'

    const query = `EXEC Masters.[SP_GSTSlabs] '','${GSTSlab}','${Tax}','${SGST}','${CGST}','${IGST}', '${CreatedBy}','${branchid}','${mode}'`

    const response = await db.query(query);

    console.log(query)

    res.status(200).send(response.recordset)

  } catch (err) {

    console.error('Error in login:', err);


    res.status(500).json({ error: 'Internal Server Error' });
  }

});


server.get('/GSTSlabsSelect', async (req, res) => {

  try {

    const mode = 'S'

    const query = `EXEC [Masters].[SP_GSTSlabs] '','','','','','','','','${mode}'`;

    const response = await db.query(query);

    const send = response.recordset

    res.status(200).json({ send });

  } catch (err) {

    console.error('Error in login:', err);

    res.status(500).json({ error: 'Internal Server Error' });

  }

});



server.post('/GSTSlabsUpdate', async (req, res) => {

  try {

    const { GSTSlab_ID, GSTSlab, Tax, SGST, CGST, IGST, CreatedBy, branchid } = req.body;

    console.log(req.body)

    const mode = 'U'

    const query = `EXEC [Masters].[SP_GSTSlabs] '${GSTSlab_ID}','${GSTSlab}','${Tax}','${SGST}','${CGST}','${IGST}','${CreatedBy}','${branchid}','${mode}' `;

    const response = await db.query(query);

    res.status(200).send(response.recordset);

  } catch (err) {

    console.error('Error in updating user:', err);

    res.status(500).json({ error: 'Internal Server Error' });

  }

});


server.post('/GSTSlabsEdit', async (req, res) => {

  const { GSTSlab_ID } = req.body;

  const mode = 'V'

  const query = `Exec [Masters].[SP_GSTSlabs] '${GSTSlab_ID}','','','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});


server.post('/GSTSlabsView', async (req, res) => {

  const { GSTSlab_ID } = req.body;

  const mode = 'V'

  const query = `Exec [Masters].[SP_GSTSlabs] '${GSTSlab_ID}','','','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});

server.post('/GSTSlabsInActive', async (req, res) => {

  const { GSTSlab_ID } = req.body;

  const mode = 'IA'

  const query = `Exec [Masters].[SP_GSTSlabs] '${GSTSlab_ID}','','','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});



server.post('/ProcessFlow', async (req, res) => {

  try {

    const { PartNumber, Code, Process, CheckPoints, Specification, Method, CreatedBy, branchid } = req.body;

    console.log(req.body)

    const mode = 'I'

    const query = `EXEC  [Masters].[SP_ProcessFlow] '','${PartNumber}','${Code}','${Process}','${CheckPoints}','${Specification}','${Method}', '${CreatedBy}','${branchid}','${mode}'`

    const response = await db.query(query);

    console.log(query)

    res.status(200).send(response.recordset)

  } catch (err) {

    console.error('Error in login:', err);


    res.status(500).json({ error: 'Internal Server Error' });
  }

});


server.get('/ProcessFlowSelect', async (req, res) => {

  try {

    const mode = 'S'

    const query = `EXEC [Masters].[SP_ProcessFlow] '','','','','','','','','','${mode}'`;

    const response = await db.query(query);

    const send = response.recordset

    res.status(200).json({ send });

  } catch (err) {

    console.error('Error in login:', err);

    res.status(500).json({ error: 'Internal Server Error' });

  }

});



server.post('/ProcessFlowUpdate', async (req, res) => {

  try {

    const { PF_ID, PartNumber, Code, Process, CheckPoints, Specification, Method, CreatedBy, branchid } = req.body;

    console.log(req.body)

    const mode = 'U'

    const query = `EXEC [Masters].[SP_ProcessFlow] '${PF_ID}','${PartNumber}','${Code}','${Process}','${CheckPoints}','${Specification}','${Method}','${CreatedBy}','${branchid}','${mode}' `;

    const response = await db.query(query);

    res.status(200).send(response.recordset);

  } catch (err) {

    console.error('Error in updating user:', err);

    res.status(500).json({ error: 'Internal Server Error' });

  }

});


server.post('/ProcessFlowEdit', async (req, res) => {

  const { PF_ID } = req.body;

  const mode = 'V'


  const query = `Exec [Masters].[SP_ProcessFlow] '${PF_ID}','','','','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});


server.post('/ProcessFlowView', async (req, res) => {

  const { PF_ID } = req.body;

  const mode = 'V'

  const query = `Exec SP_ProcessFlow '${PF_ID}','','','','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});

server.post('/ProcessFlowInActive', async (req, res) => {

  const { PF_ID } = req.body;

  const mode = 'IA'

  const query = `Exec [Masters].[SP_ProcessFlow] '${PF_ID}','','','','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});



server.post('/Correction', async (req, res) => {

  try {

    const { Code, Correction, Reset, CreatedBy, branchid } = req.body;

    console.log(req.body)

    const mode = 'I'

    const query = `EXEC  [Masters].[SP_Correction] '','${Code}','${Correction}','${Reset}','${CreatedBy}','${branchid}','${mode}'`

    const response = await db.query(query);

    console.log(query)

    res.status(200).send(response.recordset)

  } catch (err) {

    console.error('Error in login:', err);


    res.status(500).json({ error: 'Internal Server Error' });
  }

});


server.get('/CorrectionSelect', async (req, res) => {

  try {

    const mode = 'S'

    const query = `EXEC [Masters].[SP_Correction] '','','','','','','${mode}'`;

    const response = await db.query(query);

    const send = response.recordset

    res.status(200).json({ send });

  } catch (err) {

    console.error('Error in login:', err);

    res.status(500).json({ error: 'Internal Server Error' });

  }

});



server.post('/CorrectionUpdate', async (req, res) => {

  try {

    const { Corr_ID, Code, Correction, Reset, CreatedBy, branchid } = req.body;

    console.log(req.body)

    const mode = 'U'

    const query = `EXEC [Masters].[SP_Correction] ${Corr_ID}','${Code}','${Correction}','${Reset}','${CreatedBy}','${branchid}','${mode}' `;

    const response = await db.query(query);

    res.status(200).send(response.recordset);

  } catch (err) {

    console.error('Error in updating user:', err);

    res.status(500).json({ error: 'Internal Server Error' });

  }

});


server.post('/CorrectionEdit', async (req, res) => {

  const { Corr_ID } = req.body;


  const mode = 'V'


  const query = `Exec [Masters].[SP_Correction] '${Corr_ID}','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});


server.post('/CorrectionView', async (req, res) => {

  const { Corr_ID } = req.body;

  console.log(req.body)

  const mode = 'V'

  const query = `Exec [Masters].[SP_Correction] '${Corr_ID}','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});

server.post('/CorrectionInActive', async (req, res) => {

  const { Corr_ID } = req.body;

  const mode = 'IA'

  const query = `Exec [Masters].[SP_Correction] '${Corr_ID}','','','','','','${mode}'`;

  console.log(query)

  const response = await db.query(query)

  res.status(200).send(response.recordset);

});



server.post('/ProductMappingUploadData', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    let uploadcount = 0;
    const unuploadedData = [];

    for (const row of data) {
      const {
        SFProduct, ToolNumber, ApplicatorDetails, ChangeOrder, Norms, ProductStatus, branchid } = row;

      const trimString = (value) => typeof value === 'string' ? value.trim() : value;

      const trimmedSFProduct = trimString(SFProduct);
      const trimmedToolNumber = trimString(ToolNumber);
      const trimmedApplicatorDetails = trimString(ApplicatorDetails);
      const trimmedProductStatus = trimString(ProductStatus);
      const trimmedChangeOrder = trimString(ChangeOrder)
      const trimmedNorms = trimString(Norms);


      const convertExcelDateToJSDate = (excelSerialDate) => {
        const baseDate = new Date('1900-01-01');
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const daysOffset = excelSerialDate - 1;
        const totalMilliseconds = daysOffset * millisecondsPerDay;
        const resultDate = new Date(baseDate.getTime() + totalMilliseconds);
        resultDate.setHours(0, 0, 0, 0);
        return resultDate;
      };


      const originaldateformate = (date) => {
        return convertExcelDateToJSDate(date).toISOString().split('T')[0];
      }


      const mode = 'I'

      const query = `EXEC SP_ToolsSFProductMapping '','${trimmedSFProduct}','${trimmedToolNumber}','${trimmedApplicatorDetails}','${trimmedChangeOrder}','${trimmedNorms}','${mode}'`

      const response = await db.query(query);

      if (response && Array.isArray(response.rowsAffected) && response.rowsAffected.length > 0) {
        const rowsAffected = response.rowsAffected[0];
        if (typeof rowsAffected === 'number' && rowsAffected > 0) {
          uploadcount++;
        }
      } else {
        unuploadedData.push({
          Name: row.Name,
          EmployeeId: row.EmployeeId,
          DateofBirth: row.DateofBirth,
          Contact: row.Contact,
          EmailId: row.EmailId,
          DateofJoining: row.DateofJoining,
          DesignationoftheEmployee: row.DesignationoftheEmployee
        });

      }

      if (unuploadedData.length > 0) {
        const unuploadedWorkbook = xlsx.utils.book_new();
        const unuploadedWorksheet = xlsx.utils.json_to_sheet(unuploadedData);
        xlsx.utils.book_append_sheet(unuploadedWorkbook, unuploadedWorksheet, 'Unuploaded User Data');

        const unuploadedFilePath = path.join(__dirname, 'unuploaded_User_data.xlsx');
        xlsx.writeFile(unuploadedWorkbook, unuploadedFilePath);

        res.status(200).json({
          message: 'Data uploaded with some errors',
          uploadcount,
          unuploadedFilePath: `/unuploaded_ProductMapping_data`,
        });
      } else {
        res.status(200).json({ message: 'Data uploaded successfully', uploadcount });
      }
    }

  } catch (err) {
    logErrorToFile(err.message);
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

server.get('/unuploaded_ProductMapping_data', (req, res) => {

  const filePath = path.join(__dirname, 'unuploaded_ProductMapping_data.xlsx');

  res.download(filePath, 'unuploaded_ProductMapping_data.xlsx', (err) => {

    if (err) {

      console.error('File download error:', err);

      res.status(500).send('Error downloading file.');

    }
  });

});


server.post('/ProductMapping', async (req, res) => {

  try {

    const { SFProduct, ToolNumber, ApplicatorDetails, ChangeOrder, Norms, CreatedBy, branchid } = req.body;

    console.log(req.body)

    const mode = 'I'

    const query = `EXEC [Masters].[SP_ToolsSFProductMapping] '','${SFProduct}','${ToolNumber}','${ApplicatorDetails}','${ChangeOrder}','${Norms}', '${CreatedBy}','${branchid}','${mode}'`

    const response = await db.query(query);

    console.log(query)

    res.status(200).send(response.recordset)

  } catch (err) {

    console.error('Error in login:', err);


    res.status(500).json({ error: 'Internal Server Error' });
  }

});


server.post('/ProductMappingSelects', async (req, res) => {

  try {

    const mode = 'S'

    const query = `EXEC [Masters].[SP_ToolsSFProductMapping] '','','','','','','','','${mode}'`;

    const response = await db.query(query);

    const send = response.recordset

    console.log(send)

    res.status(200).json({ send });


  } catch (err) {

    console.error('Error in login:', err);

    res.status(500).json({ error: 'Internal Server Error' });

  }

});



server.post('/ProductMappingUpdate', async (req, res) => {

  try {

    const { TSFPM_ID, SFProduct, ToolNumber, ApplicatorDetails, ChangeOrder, Norms, CreatedBy, branchid } = req.body;

    console.log(req.body)

    const mode = 'U'

    const query = `EXEC [Masters].[SP_ToolsSFProductMapping] '${TSFPM_ID}','${SFProduct}','${ToolNumber}','${ApplicatorDetails}','${ChangeOrder}','${Norms}','${CreatedBy}','${branchid}','${mode}' `;

    const response = await db.query(query);

    res.status(200).send(response.recordset);

  } catch (err) {

    console.error('Error in updating user:', err);

    res.status(500).json({ error: 'Internal Server Error' });

  }

});


server.post('/ProductMappingEdit', async (req, res) => {

  const { TSFPM_ID } = req.body;

  const mode = 'V'

  const query = `Exec [Masters].[SP_ToolsSFProductMapping] '${TSFPM_ID}','','','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});


server.post('/ProductMappingView', async (req, res) => {

  const { TSFPM_ID } = req.body;

  const mode = 'V'

  const query = `Exec [Masters].[SP_ToolsSFProductMapping] '${TSFPM_ID}','','','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});


server.post('/ProductMappingInActive', async (req, res) => {

  const { TSFPM_ID } = req.body;

  const mode = 'IA'

  const query = `Exec [Masters].[SP_ToolsSFProductMapping] '${TSFPM_ID}','','','','','','','','${mode}'`;

  const response = await db.query(query)

  const send = response.recordset

  res.status(200).json({ send });


});

server.post('/AddToolsandSpares', async (req, res) => {
  try {
    const { CreatedBy, branchid, ToolNo, Description, Thickness, Width, Length, Height, Breadth, ToolWeight, MinStock, LifeTime, DangerLevel, Applicator, BladeType, Status } = req.body
    const mode = 'I';
    const InsertQuery = `EXEC Masters.SP_ToolsandSpares '','${ToolNo}','${Description}','${Thickness}','${Width}','${Length}','${Height}','${Breadth}','${ToolWeight}','${MinStock}','${LifeTime}','${DangerLevel}','${Applicator}','${BladeType}','','${CreatedBy}','','${branchid}','${mode}'`
    const response = await db.query(InsertQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log("Error on Machine Master ", err)
  }
})

server.get('/FetchToolsandSpares', async (req, res) => {
  try {
    const mode = 'S'
    const SelectQuery = `EXEC Masters.SP_ToolsandSpares '','','','','','','','','','','','','','','','','','','${mode}'`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })

  } catch (err) {
    console.log("error on Fech Operator", err)
  }
})

server.post('/ToolsDetailsIndividual', async (req, res) => {
  try {
    const { TS_ID, mode } = req.body
    const SelectQuery = `EXEC Masters.SP_ToolsandSpares '${TS_ID}','','','','','','','','','','','','','','','','','','${mode}'`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })

  } catch (err) {
    console.log("error on Fetch Machine Details Individual", err)
  }
})

server.post('/UpdateToolsandSpares', async (req, res) => {
  try {
    const { UpdatedBy, ToolNo, Description, Thickness, Width, Length, Height, Breadth, ToolWeight, MinStock, LifeTime, DangerLevel, Applicator, BladeType, Status, TS_ID } = req.body
    const mode = 'U';
    const UpdateQuery = `EXEC Masters.SP_ToolsandSpares '${TS_ID}','${ToolNo}','${Description}','${Thickness}','${Width}','${Length}','${Height}','${Breadth}','${ToolWeight}','${MinStock}','${LifeTime}','${DangerLevel}','${Applicator}','${BladeType}','${Status}','','${UpdatedBy}','','${mode}'`
    const response = await db.query(UpdateQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log("Error on Toolsand Spares ", err)
  }
})
server.post('/InActive_ToolsandSpares', async (req, res) => {
  try {
    const { TS_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_ToolsandSpares '${TS_ID}','','','','','','','','','','','','','','','','','','${mode}'`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})
// Upload Operator 
server.post('/ToolsandSpares_Upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { CreatedBy, branchid } = req.body;
    const mode = 'Import'
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    let uploadcount = 0;
    const unuploadedData = [];
    const convertExcelDateToJSDate = (excelSerialDate) => {
      const baseDate = new Date('1900-01-01');
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysOffset = excelSerialDate - 1;
      const totalMilliseconds = daysOffset * millisecondsPerDay;
      const resultDate = new Date(baseDate.getTime() + totalMilliseconds);
      resultDate.setHours(0, 0, 0, 0);
      return resultDate;
    };
    const originaldateformate = (date) => {
      return convertExcelDateToJSDate(date).toISOString().split('T')[0];
    }
    for (const row of data) {
      const {
        ToolNo, Description, Thickness, Width, Length, Height, Breadth, ToolWeight,
        MinStock, LifeTime, DangerLevel, Applicator, BladeType, Status
      } = row;
      const trimString = (value) => typeof value === 'string' ? value.trim() : value;
      const trimmedToolNo = trimString(ToolNo);
      const trimmedDescription = trimString(Description);
      const trimmedThickness = trimString(Thickness);
      const trimmedWidth = trimString(Width);
      const trimmedLength = trimString(Length);
      const trimmedHeight = trimString(Height);
      const trimmedBreadth = trimString(Breadth);
      const trimmedToolWeight = trimString(ToolWeight);
      const trimmedMinStock = trimString(MinStock);
      const trimmedLifeTime = trimString(LifeTime);
      const trimmedDangerLevel = trimString(DangerLevel);
      const trimmedApplicator = trimString(Applicator);
      const trimmedBladeType = trimString(BladeType);
      const trimmedStatus = trimString(Status);

      const InsertQuery = `EXEC Masters.SP_ToolsandSpares '','${trimmedToolNo}','${trimmedDescription}','${trimmedThickness}','${trimmedWidth}','${trimmedLength}','${trimmedHeight}','${trimmedBreadth}','${trimmedToolWeight}','${trimmedMinStock}','${trimmedLifeTime}','${trimmedDangerLevel}','${trimmedApplicator}','${trimmedBladeType}','${trimmedStatus}','${CreatedBy}','','${branchid}','${mode}'`
      const response = await db.query(InsertQuery)
      if (response.rowsAffected && response.rowsAffected[0] > 0) {
        uploadcount++;
      } else {
        unuploadedData.push({
          ToolNo: row.ToolNo, Description: row.Description, Thickness: row.Thickness, Width: row.Width, Length: row.Length, Height: row.Height, Breadth: row.Breadth, ToolWeight: row.ToolWeight, MinStock: row.MinStock, LifeTime: row.LifeTime, DangerLevel: row.DangerLevel, Applicator: row.Applicator, BladeType: row.BladeType, Status: row.Status
        });
      }

    }

    if (unuploadedData.length > 0) {
      const unuploadedWorkbook = xlsx.utils.book_new();
      const unuploadedWorksheet = xlsx.utils.json_to_sheet(unuploadedData);
      xlsx.utils.book_append_sheet(unuploadedWorkbook, unuploadedWorksheet, 'Unuploaded Tools and Spares Data');

      const unuploadedFilePath = path.join(__dirname, 'unuploaded_ToolsandSpares_data.xlsx');
      xlsx.writeFile(unuploadedWorkbook, unuploadedFilePath);
      res.status(200).json({
        message: 'Data uploaded with some errors',
        uploadcount,
        unuploadedFilePath: `/unuploaded_ToolsandSpares_data.xlsx`,
      });

    } else {
      res.status(200).json({ message: 'Data uploaded successfully', uploadcount });
    }

  } catch (err) {
    logErrorToFile(err.message);
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
server.get('/unuploaded_ToolsandSpares_data.xlsx', (req, res) => {
  const filePath = path.join(__dirname, 'unuploaded_ToolsandSpares_data.xlsx');
  res.download(filePath, 'unuploaded_ToolsandSpares_data.xlsx', (err) => {
    if (err) {
      console.error('File download error:', err);
      res.status(500).send('Error downloading file.');
    }
  });
});


// Tools Product Mapping

server.post('/ToolsProductMapping', async (req, res) => {
  try {
    const { Product, ToolNo, ApplicatorDetails, CO, Norms, branchid, CreatedBy } = req.body
    const mode = 'I'
    // console.log(req.body)
    const InserQuery = `EXEC Masters.SP_ToolsProductMapping '','${Product}','${ToolNo}','${ApplicatorDetails}','${CO}','${Norms}','${CreatedBy}','','','${branchid}','${mode}'`
    // console.log(InserQuery)
    const response = await db.query(InserQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log(err)
  }
})
server.get('/ToolProductMapping_Details', async (req, res) => {
  try {
    const mode = 'S'
    const SelectQuery = `EXEC Masters.SP_ToolsProductMapping '','','','','','','','','','','${mode}'`
    const response = await db.query(SelectQuery)
    const send = response.recordset
    res.status(200).json({ send })

  } catch (err) {
    console.log(err)
  }
})
server.post('/ToolProductMappedDetails_Individual', async (req, res) => {
  try {
    const { TPM_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_ToolsProductMapping '${TPM_ID}','','','','','','','','','','${mode}'`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})
server.post('/UpdateToolProductMapping', async (req, res) => {
  try {
    const { TPM_ID, Product, ToolNo, ApplicatorDetails, CO, Norms, branchid, CreatedBy,Status,UpdatedBy } = req.body
    const mode = 'U'
    const UpdateQuery = `EXEC Masters.SP_ToolsProductMapping '${TPM_ID}','${Product}','${ToolNo}','${ApplicatorDetails}','${CO}','${Norms}','','${UpdatedBy}','${Status}','${branchid}','${mode}'`
    const response = await db.query(UpdateQuery)
    res.status(200).send(response.recordset)

  } catch (err) {
    console.log(err)
  }
})
server.post('/InActive_ToolProductMapping', async (req, res) => {
  try {
    const { TPM_ID, mode } = req.body;
    const ViewQuery = `EXEC Masters.SP_ToolsProductMapping '${TPM_ID}','','','','','','','','','','${mode}'`
    const response = await db.query(ViewQuery)
    const send = response.recordset
    res.status(200).json({ send })
  } catch (err) {
    console.log(err)
  }
})


function logErrorToFile(error) {
  const currentDate = new Date().toISOString();
  const logMessage = `[${currentDate}] ${error}\n`;

  const logFolder = path.join(__dirname, 'log'); // Creates a log folder in the current directory


  // Check if the log folder exists, if not, create it
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
  }

  const logFilePath = path.join(logFolder, 'error.txt');

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}


server.listen(PORT, () => {
  console.log(`Server is connected ${PORT}`);
});
