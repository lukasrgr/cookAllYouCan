import 'dart:developer';

import 'package:cook_all_you_can/index/pages/shared/database/sqflite/query.dart';
import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'pages/shared/service/service.dart' as Service;
import 'theme/theme.dart';

// import 'HomePage.dart';
class LoginDemo extends StatefulWidget {
  const LoginDemo({super.key, required this.storage});

  final CounterStorage storage;
  @override
  _LoginDemoState createState() => _LoginDemoState();
}

class _LoginDemoState extends State<LoginDemo> {
  final supabase = Supabase.instance.client;
  final _formKey = GlobalKey<FormState>();
  TextEditingController userNameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  var token = false;

  void initState() {
    super.initState();

    validateStoredCredentials();
  }

  login() async {
    var loginSnackbar =
        showNotification(context, "Authenticating", MyThemes.primaryColor);

    await supabase.auth
        .signInWithPassword(
      email: userNameController.text,
      password: passwordController.text,
    )
        .then((res) async {
      await supabase
          .from('user_household')
          .select('household_id, id, household(*)')
          .match({'user_id': supabase.auth.currentUser!.id}) //
          .then((user_household) async {
        var household = user_household[0]['household'];
        Service.Service.user = new Service.User(

            //TODO: Create unique identifier for user
            0,
            userNameController.text,
            passwordController.text,
            household['text'],
            household['id'] as int);

        await SqfLiteHandler.insertUser(Service.Service.user);

        if (res.user?.aud == 'authenticated') {
          loginSnackbar.close();
          TextInput.finishAutofillContext();
          Navigator.pushReplacementNamed(context, '/index');
        }
      });
    }).catchError((error) {
      loginSnackbar.close();
      var snackbar = showNotification(context, "Login failed", Colors.red);
      Future.delayed(Duration(seconds: 2)).then((value) => {snackbar.close()});
    });
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    return Scaffold(
      body: Center(
          child: SingleChildScrollView(
              child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      token == true
                          ? Center(
                              child: CircularProgressIndicator(),
                            )
                          : Padding(
                              padding:
                                  const EdgeInsets.only(bottom: 10, top: 20),
                              //padding: EdgeInsets.symmetric(horizontal: 15),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Image.asset(
                                    "assets/images/logo-branding.png",
                                    width:
                                        toDouble(mediaQuery.size.width * 0.6),
                                  ),
                                ],
                              )),
                      Padding(
                        //padding: const EdgeInsets.only(left:15.0,right: 15.0,top:0,bottom: 0),
                        padding: EdgeInsets.symmetric(horizontal: 15),
                        child: TextFormField(
                            controller: userNameController,
                            autofillHints: [AutofillHints.username],
                            validator: (value) => validateTextForm(value),
                            decoration: MyThemes.ThemedInputDecoration(
                                'Email', 'Email in form of abc@gmail.com')),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(
                            left: 15.0, right: 15.0, top: 15, bottom: 0),
                        //padding: EdgeInsets.symmetric(horizontal: 15),
                        child: TextFormField(
                            controller: passwordController,
                            autofillHints: [AutofillHints.password],
                            obscureText: true,
                            validator: (value) => validateTextForm(value),
                            decoration: MyThemes.ThemedInputDecoration(
                                'Password', 'Password')),
                      ),
                      Padding(
                          padding: const EdgeInsets.only(top: 20.0),
                          child: null //Text("Welcome"),
                          ),
                      Container(
                        height: 50,
                        width: 250,
                        decoration: BoxDecoration(
                            color: MyThemes.primaryColor,
                            borderRadius: BorderRadius.circular(20)),
                        child: IconButton(
                            onPressed: () async {
                              login();
                            },
                            icon: Container(
                              child: Text(
                                "Login",
                                style: TextStyle(color: Colors.black),
                              ),
                            )),
                      ),
                      SizedBox(
                        height: 130,
                      ),
                    ],
                  )))),
    );
  }

  Future<void> validateStoredCredentials() async {
    await supabase.auth.onAuthStateChange.listen((event) async {
      var user = await SqfLiteHandler.getUsers();

      if (user.household.isEmpty) {}
      // var filter = await SqfLiteHandler.getRecipeFilter();
      if (event.event.name == 'signedIn' && user.household.isNotEmpty) {
        Service.Service.user = user;
        Navigator.popAndPushNamed(context, '/index');
      } else {
        await supabase.auth
            .signInWithPassword(
          email: user.userName,
          password: user.password,
        )
            .then((res) async {
          Service.Service.user = user;
          Navigator.popAndPushNamed(context, '/index');
        }).onError((error, stackTrace) {
          // loginSnackbar.close();
          // var snackbar = showNotification(
          //     context,
          //     "stored user has no valid credentials or is not existing",
          //     Colors.red);
        }).whenComplete(() {
          setState(() {
            token = true;
          });
        });
      }
    });
    // var user = await SqfLiteHandler.getUsers();
  }

  // void _loadSavedData() {
  //   Future.wait([
  //     loadDeviceData("primaryColor"), //
  //     loadDeviceData("secondaryColor") //
  //   ]).then((value) {
  //     if (value.isEmpty) {
  //       return;
  //     }
  //     var customPrimaryColor = value[0];
  //     var customSecondaryColor = value[1];

  //     setState(() {
  //       MyThemes.primaryColor = parseColorStringToColor(customPrimaryColor!) ??
  //           MyThemes.primaryColor;
  //       MyThemes.secondaryColor =
  //           parseColorStringToColor(customSecondaryColor!) ??
  //               MyThemes.secondaryColor;
  //       // MyThemes.primaryColor = parseColorStringToColor(customPrimaryColor!) ??
  //       //     MyThemes.primaryColor;
  //       // secondaryColor = parseColorStringToColor(customSecondaryColor!);

  //       MyThemes.customTheme = MyThemes.getThemeData(
  //           parseColorStringToColor(customPrimaryColor!) ??
  //               MyThemes.primaryColor,
  //           parseColorStringToColor(customSecondaryColor!) ??
  //               MyThemes.secondaryColor);
  //     });
  //   });
  // }

  Future<bool> _validateDeviceStorageOld() {
//     Future.wait([
//       loadDeviceData("email"), //
//       loadDeviceData("password") //
//     ]).then((value) {
//       var email = value[0];
//       var password = value[1];

//       if (password == null ||
//           email == null ||
//           password.isEmpty ||
//           email.isEmpty) {
//         return false;
//       }

// // TODO refactor, put in seperate file
//       supabase.auth
//           .signInWithPassword(email: email, password: password) //
//           .then((value) async {
//         debugger();
//         await supabase
//             .from('user_household')
//             .select('household_id')
//             .match({'user_id': supabase.auth.currentUser!.id}) //
//             .then((user_household) async {
//           await supabase.from('household').select('text').match(
//               {'id': user_household[0]['household_id']}).then((household) {
//             Service.user.setHousehold(
//                 household[0]['text'], user_household[0]['household_id']);
//             Service.user.setUserName(email);
//             debugger();
//             saveDataOnDevice('household', household[0]['text']);
//           });
//         });
//         Navigator.popAndPushNamed(context, '/index');
//       });
//     });

    return Future.value(false);
  }

//   Future<bool> _validateDeviceStorage() {
//     Future.wait([
//       widget.storage.read('password'), //
//       widget.storage.read('email'), //
//     ]).then((value) {
//       var email = value[0];
//       var password = value[1];

//       if (password == null ||
//           email == null ||
//           password.isEmpty ||
//           email.isEmpty) {
//         return false;
//       }

// // TODO refactor, put in seperate file
//       supabase.auth
//           .signInWithPassword(email: email, password: password) //
//           .then((value) async {
//         await supabase
//             .from('user_household')
//             .select('household_id')
//             .match({'user_id': supabase.auth.currentUser!.id}) //
//             .then((user_household) async {
//           await supabase.from('household').select('text').match(
//               {'id': user_household[0]['household_id']}).then((household) {
//             Service.Service.user.setHousehold(
//                 household[0]['text'], user_household[0]['household_id']);
//             Service.Service.user.setUserName(email);
//             debugger();
//             saveDataOnDevice('household', household[0]['text']);
//           });
//         });
//         Navigator.popAndPushNamed(context, '/index');
//       });
//     });

//     return Future.value(false);
//   }
}
