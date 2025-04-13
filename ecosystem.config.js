module.exports = {
    apps: [{
        name: "dzAuto",
        script: "yarn",
        args: "preview",
        cwd: "/home/sizar/cars/cars-3years",  // Change to your project path
        interpreter: "/bin/bash",
        env: {
            NODE_ENV: "production"
        }
    }]
}