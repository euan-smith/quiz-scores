/**
 * Created by EuanSmith on 15/03/2017.
 */

const username = require('username');
const exec = require('child_process').exec;

username().then(user=>{
  const cu=exec(`psql -U postgres -c "CREATE ROLE ${user} WITH CREATEDB LOGIN"`);
  cu.stdout.pipe(process.stdout);
  cu.on('exit',function(){
    console.log(`User ${user} created.`);
    const cdb=exec(`psql --set=user=${user} -U postgres -f db\\setup.sql`);
    cdb.stdout.pipe(process.stdout);
    cdb.on('exit',function(){
      console.log('Database created.');
      process.exit();
    })
  })
});