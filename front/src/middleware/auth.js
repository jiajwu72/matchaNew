
module.exports = (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next(
      {
        path: "/",
        query: { connectModal: true },
        // props: {notConnected:true}
      },);
    } else {
      next();
    }
  } else {
    next();
  }

};
