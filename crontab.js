var cron = require('node-cron');
var fetcher = require('./index');
 
var task = cron.schedule('0 11 * * *', () =>  {
  // console.log('will not execute anymore, nor be able to restart');
  fetcher.start();
});
 
// task.destroy();

// require('crontab').load(function(err, crontab) {
//   // reset jobs to their original state
//   crontab.reset();

//   // save
//   crontab.save(function(err, crontab) {
//     if(err) {
//       console.log(err);
//     }
//     console.log(crontab);
//   });

  


//   // // save
//   // crontab.save(function(err, crontab) {
//   //   if(err) {
//   //     console.log(err);
//   //   }
//   // });
// });