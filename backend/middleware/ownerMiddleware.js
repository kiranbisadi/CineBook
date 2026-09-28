const ownerOnly = (req, res, next) => {
  if (req.user && req.user.role === "theatreOwner") {
    next();
  } else {
    return res.status(403).json({
      message: "Theatre owner access required",
    });
  }
};

module.exports = ownerOnly;
