const isLoggedIn = (req, res, next) => {

    if (req.session.currentUser) {
        next()
    } else {
        res.redirect("/")
    }
}

const checkRole = (...admitedRoles) => (req, res, next) => {

    const { role } = req.session.currentUser.role

    if (admitedRoles.includes(role)) {
        next()
    } else {
        res.redirect("/iniciar-sesion")
    }
}

const canEditProfile = (req, res, next) => {
    const { id } = req.params

    const loggedInUser = req.session.currentUser

    if (loggedInUser.role === 'PM' || loggedInUser._id.toString() === id) {
        return next()
    } else {
        return res.status(403).send('You are not authorized to edit this profile.');
    }
};




module.exports = { isLoggedIn, checkRole, canEditProfile }

