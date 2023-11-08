const router = require("express").Router()
const User = require("../models/User.model")

const { isLoggedIn, checkRole, canEditProfile } = require("../middleware/route-guard")

router.get("/", (req, res, next) => {
  res.render("index")
})

router.get("/students", isLoggedIn, (req, res) => {

  User
    .find({ role: "STUDENT" })
    .then(users => res.render("students/studentslist", { users }))
    .catch(err => console.log("no te muestro los students", err))
})


router.get("/students/:id", isLoggedIn, (req, res) => {
  const { id } = req.params

  User
    .findById({ _id: id })
    .then(student => {
      const isPm = req.session.currentUser.role === "PM"
      console.log(student, '-----', isPm)
      res.render("students/studentprofile", {
        student,
        isPm
      })
    })
    .catch(err => console.log("no te muestro el perfil del student", err))
})

router.get("/students/edit/:id", canEditProfile, (req, res) => {

  const { id } = req.params
  User
    .findById(id)
    .then(student => res.render("students/studentedit", student))
    .catch(err => console.log("no te mando a editar", err))
})
router.get("/students/edit/:id", checkRole("PM"), (req, res) => {

  const { id } = req.params
  User
    .findById(id)
    .then(student => res.render("students/studentedit", student))
    .catch(err => console.log("no te mando a editar", err))
})

router.post("/students/edit/:id", (req, res) => {
  const { username, email, description } = req.body
  const { id } = req.params

  User
    .findByIdAndUpdate(id, { username, email, description })
    .then(() => res.redirect("/students"))
    .catch(err => console.log("no te dejo editar", err))

})

router.post("/students/delete/:id", (req, res) => {

  const { id } = req.params

  User
    .findByIdAndDelete(id)
    .then(() => res.redirect("/students"))
    .catch(err => console.log("no te dejo eliminar", err))

})
router.post("/students/changeroletodev/:id", (req, res) => {

  const { id } = req.params

  User
    .findByIdAndUpdate(id, { role: "DEV" }, { new: true })
    .then(() => res.redirect("/students"))
    .catch(err => console.log("no cambio a DEV", err))

})
router.post("/students/changeroletota/:id", (req, res) => {

  const { id } = req.params

  User
    .findByIdAndUpdate(id, { role: "TA" }, { new: true })
    .then(() => res.redirect("/students"))
    .catch(err => console.log("no cambio a TA", err))

})



module.exports = router
