var shutdown = require('../app').shutdown;

after(function(done) {
    shutdown();
    done();
});
