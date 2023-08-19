import 'dart:developer';
import 'dart:io';

import 'package:cook_all_you_can/index/overview/overview.dart';
import 'package:cook_all_you_can/index/overview/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../button.dart';

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

  Future<bool> validateDeviceStorage() {
    Future.wait([
      loadDeviceData("email"), //
      loadDeviceData("password") //
    ]).then((value) {
      var email = value[0];
      var password = value[1];

      if (password == null ||
          email == null ||
          password.isEmpty ||
          email.isEmpty) {
        return false;
      }

      supabase.auth
          .signInWithPassword(email: email, password: password) //
          .then((value) => {
                Navigator.popAndPushNamed(context, '/overview').then((value) {
                  // return false;
                })
              });
    });

    return Future.value(false);
  }

  TextEditingController userNameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  var token = true;

  void initState() {
    super.initState();
    validateDeviceStorage().then((value) => {
          setState(() {
            token = value;
          })
        });
    loadSavedData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              token == true
                  ? Center(
                      child: CircularProgressIndicator(),
                    )
                  : Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      //padding: EdgeInsets.symmetric(horizontal: 15),
                      child: Column(
                        children: [
                          Image(
                            image: AssetImage(
                                'assets/images/logo_with_new_color.png'),
                            fit: BoxFit.cover,
                            width: 250,
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
                  decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Email',
                      hintText: 'Email in form of abc@gmail.com'),
                ),
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
                  decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Password',
                      hintText: 'Password'),
                ),
              ),
              Padding(
                  padding: const EdgeInsets.only(top: 20.0),
                  child: null //Text("Welcome"),
                  ),
              Container(
                height: 50,
                width: 250,
                decoration: BoxDecoration(
                    color: primaryColor,
                    borderRadius: BorderRadius.circular(20)),
                child: IconButton(
                    onPressed: () async {
                      var loginSnackbar = showNotification(
                          context, "Authenticating", primaryColor);
                      await supabase.auth
                          .signInWithPassword(
                        email: userNameController.text,
                        password: passwordController.text,
                      )
                          .then((res) async {
                        if (res.user?.aud == 'authenticated') {
                          loginSnackbar.close();
                          TextInput.finishAutofillContext();
                          saveDataOnDevice("email", userNameController.text);
                          saveDataOnDevice("password", passwordController.text);
                          Navigator.pushReplacementNamed(context, '/overview');
                        }
                      }).catchError((error) {
                        loginSnackbar.close();
                        var snackbar = showNotification(
                            context, "Login failed", Colors.red);
                        Future.delayed(Duration(seconds: 2))
                            .then((value) => {snackbar.close()});
                      });
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
          )),
    );
  }

  void loadSavedData() {
    Future.wait([
      loadDeviceData("primaryColor"), //
      loadDeviceData("secondaryColor") //
    ]).then((value) {
      var customPrimaryColor = value[0];
      var customSecondaryColor = value[1];

      setState(() {
        primaryColor = parseColorStringToColor(customPrimaryColor!);
        // secondaryColor = parseColorStringToColor(customSecondaryColor!);
      });
    });
  }
}
