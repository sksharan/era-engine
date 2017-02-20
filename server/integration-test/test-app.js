const proxyquire = require('proxyquire');

proxyquire('../main/app', {
    './config': require('./test-config'),
    './on-init': function() {
        /* Run the integration tests in the directories provided via command line. */
        const Mocha = require('mocha');
        const mocha = new Mocha();
        const fs = require('fs');
        const path = require('path');

        process.argv.forEach(function(val, index, array) {
            if (index > 1) {
                const directory = val;
                fs.readdirSync(directory).forEach(function(testFilename) {
                    /* Assume every file in the directory is a .js file. */
                    mocha.addFile(path.join(directory, testFilename));
                });
            }
        });
        mocha.run().on('end', function() {
            process.exit(0);
        });
    }
});
