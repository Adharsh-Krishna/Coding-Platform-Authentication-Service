// const spawn = require('child_process').execFile;
// const cmd=require('node-command-line');
const mailer=require('nodemailer');

exports.find_document=function (ins,param) {
    console.log(param);
    return new Promise(function (resolve, reject) {
        ins.find(param).then(function (data) {
            if(data.length===0)
            {
                reject(new Error("user not found"));
            }
            resolve(data[0]);
        }).catch(function () {
            reject(new Error("could not retrieve data"));
        })
    })
}

//
//
// exports.check_password=function (dbpass,reqpass) {
//     console.log(dbpass);
//     console.log(reqpass);
//     return new Promise(function (resolve,reject) {
//         if(reqpass===dbpass)
//         {
//             resolve("CORRECT PASS");
//         }
//         reject(new Error("incorrect password"));
//     })
// }

// exports.compile_and_run_code= function (filename, type,prob_id) {
//     return new Promise(async function (resolve,reject) {
//         setTimeout(function () {
//             reject(new Error("exceeded"));
//         },2000);
//         let compile =await spawn('gcc', [filename+"."+type,'-o',filename],function (error) {
//             if (error) {
//                 console.log(error.message);
//                 reject(error);
//             }
//             else
//             {
//                 console.log("compiled"+filename);
//                 resolve(true);
//             }
//         });
//     });
//
// }
//
// exports.run_code= function (filename,prob_id) {
//     return new Promise(async function (resolve,reject) { setTimeout(function () {
//         reject(new Error("exceeded"));
//     },2000);
//         console.log(filename);
//         let command='./'+filename+' < '+'codes/'+prob_id+'-input.txt'+' > '+'codes/'+prob_id+'-user-output.txt';
//       let run= await cmd.run(command);
//       if(run.success)
//       {
//           let json={user_output:"",actual_output:""};
//           let data1=await fs.readFileSync('codes/'+prob_id+'-user-output.txt',"utf8",function (err,data1) {
//               if(err) {
//                   reject(new Error("some error"));
//               }
//           });
//           json.user_output=data1;
//           let data2=await fs.readFileSync('codes/'+prob_id+'-output.txt', "utf8",function (err,data2) {
//              if(err)
//              {
//                  reject(new Error("some error1"));
//              }
//
//           });
//           json.actual_output=data2;
//           resolve(json);
//       }
//       else
//       {
//           console.log("code not running....");
//           reject(new Error("code not running"));
//       }
//
//     });
// };


const fs = require("fs");
exports.write_file=function (name,type,text) {
    let file_name="codes/"+name+"."+type;
    fs.writeFileSync(file_name,text,function () {
        console.log("written");
    });
};

/*' < ',prob_id+"-input.txt",' > ', prob_id+"-user-output.txt"*/

/* compile.on('close', function (data) {
           if (data === 0) {
               var run = spawn('./'+filename, []);
               run.stdout.on('data', function (output) {
                   console.log(String(output));
                   resolve(String(output));
               });
               run.stderr.on('data', function (output) {
                   console.log(String(output));
                   reject(new Error("could not run code"));
               });
               run.on('close', function (output) {
                   console.log('stdout: ' + output);
                   resolve(output);
               });
           }
       });*/