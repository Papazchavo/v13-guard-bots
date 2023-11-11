const name = "Papaz"

module.exports = {
    apps: 
    [ 
        {
        name: `${name} - Guard I`,
        script: 'main.js',
        watch: true,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Guard I"
      }, 
        {
        name: `${name} - Guard II`,
        script: 'main.js',
        watch: true,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Guard II"
      }, 
      
         ]
  };
