[1mdiff --git a/.eslintrc.js b/.eslintrc.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/.gitignore b/.gitignore[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/app.js b/app.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/images/5c8b8c47992225239d83bc0a.png b/images/5c8b8c47992225239d83bc0a.png[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/images/5c8b8f0f22f7912996d4aaaf.png b/images/5c8b8f0f22f7912996d4aaaf.png[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/images/5c8b8f4422f7912996d4aab0.png b/images/5c8b8f4422f7912996d4aab0.png[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/package.json b/package.json[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/public/images/logo.png b/public/images/logo.png[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/server.js b/server.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/admin/controller.js b/src/api/admin/controller.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/admin/index.js b/src/api/admin/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/admin/model.js b/src/api/admin/model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/auth/index.js b/src/api/auth/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/auth/jwt.model.js b/src/api/auth/jwt.model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/automobiliste/controller.js b/src/api/automobiliste/controller.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/automobiliste/index.js b/src/api/automobiliste/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/automobiliste/model.js b/src/api/automobiliste/model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/color/model.js b/src/api/color/model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/index.js b/src/api/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/manufacturer/admin/controller.js b/src/api/manufacturer/admin/controller.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/manufacturer/admin/index.js b/src/api/manufacturer/admin/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/manufacturer/controller.js b/src/api/manufacturer/controller.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/manufacturer/index.js b/src/api/manufacturer/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/manufacturer/model.js b/src/api/manufacturer/model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/manufacturer/user/controller.js b/src/api/manufacturer/user/controller.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/manufacturer/user/index.js b/src/api/manufacturer/user/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/manufacturer/user/model.js b/src/api/manufacturer/user/model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/me/index.js b/src/api/me/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/model/controller.js b/src/api/model/controller.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mindex a2cbd07..acf6799[m
[1m--- a/src/api/model/controller.js[m
[1m+++ b/src/api/model/controller.js[m
[36m@@ -57,7 +57,7 @@[m [mexports.create = [[m
     body.options = [][m
     try {[m
       body.options = storedOptions(JSON.parse(options))[m
[31m-      body.colors = await JSON.parse(colors)[m
[32m+[m[32m      body.colors = JSON.parse(colors)[m
       next()[m
     } catch (error) {[m
       console.log(error)[m
[1mdiff --git a/src/api/model/index.js b/src/api/model/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/model/model.js b/src/api/model/model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/option/model.js b/src/api/option/model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/utils/index.js b/src/api/utils/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/vehicle/controller.js b/src/api/vehicle/controller.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/vehicle/index.js b/src/api/vehicle/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/vehicle/model.js b/src/api/vehicle/model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/version/controller.js b/src/api/version/controller.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/version/index.js b/src/api/version/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/api/version/model.js b/src/api/version/model.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/config.js b/src/config.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/acl/index.js b/src/services/acl/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/archiver/index.js b/src/services/archiver/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/auth/index.js b/src/services/auth/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/crud/index.js b/src/services/crud/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/database/index.js b/src/services/database/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mindex c6b3826..71ef489[m
[1m--- a/src/services/database/index.js[m
[1m+++ b/src/services/database/index.js[m
[36m@@ -12,7 +12,7 @@[m [mmodule.exports = (cb) => {[m
     .then([m
       () => {[m
         console.log('database connected')[m
[31m-        if (cb) cb(false)[m
[32m+[m[32m        if (cb) cb(null)[m
       },[m
       (err) => {[m
         if (cb) cb(err)[m
[1mdiff --git a/src/services/http/index.js b/src/services/http/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/passport/index.js b/src/services/passport/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/passport/strategies/facebook.js b/src/services/passport/strategies/facebook.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/passport/strategies/google.js b/src/services/passport/strategies/google.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/passport/strategies/jwt.js b/src/services/passport/strategies/jwt.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/passport/strategies/local.js b/src/services/passport/strategies/local.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/passport/strategies/oauth.callback.js b/src/services/passport/strategies/oauth.callback.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/upload/index.js b/src/services/upload/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mindex 3a57e77..60e10f2[m
[1m--- a/src/services/upload/index.js[m
[1m+++ b/src/services/upload/index.js[m
[36m@@ -74,3 +74,13 @@[m [mmodule.exports.updateImages = (req, res, originalImages) => new Promise([m
     )[m
   }[m
 )[m
[32m+[m
[32m+[m[32m// const deleteImages = (images) => Promise.all(images.map([m
[32m+[m[32m//   img => new Promise((resolve, reject) => {[m
[32m+[m[32m//     const path = upload_dir + '/' + img.split('/').pop()[m
[32m+[m[32m//     fs.unlink(path, (err) => {[m
[32m+[m[32m//       if (err) return reject(err)[m
[32m+[m[32m//       resolve()[m
[32m+[m[32m//     })[m
[32m+[m[32m//   })[m
[32m+[m[32m// ))[m
[1mdiff --git a/src/services/validation/index.js b/src/services/validation/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/test/admin.test.js b/test/admin.test.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/test/index.js b/test/index.js[m
[1mold mode 100644[m
[1mnew mode 100755[m
