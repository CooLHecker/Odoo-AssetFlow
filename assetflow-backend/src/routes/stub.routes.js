const express = require("express");

// Temporary placeholder router — swap this out module by module as each
// feature (auth, departments, assets, bookings, maintenance, audits...) is built.
function stubRouter(moduleName) {
  const router = express.Router();
  router.all("*", (req, res) => {
    res.status(501).json({
      module: moduleName,
      message: `${moduleName} module not implemented yet`,
      method: req.method,
      path: req.originalUrl,
    });
  });
  return router;
}

module.exports = stubRouter;
