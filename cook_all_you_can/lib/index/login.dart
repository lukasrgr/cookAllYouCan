import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'pages/shared/service/service.dart';
import 'pages/shared/settings/theme/theme.dart';

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

// TODO refactor, put in seperate file
      supabase.auth
          .signInWithPassword(email: email, password: password) //
          .then((value) async {
        await supabase
            .from('user_household')
            .select('household_id')
            .match({'user_id': supabase.auth.currentUser!.id}) //
            .then((user_household) async {
          await supabase.from('household').select('text').match(
              {'id': user_household[0]['household_id']}).then((household) {
            Service.user.setHousehold(
                household[0]['text'], user_household[0]['household_id']);
            Service.user.setUserName(email);
            saveDataOnDevice('household', household[0]['text']);
          });
        });
        Navigator.popAndPushNamed(context, '/index');
      });
    });

    return Future.value(false);
  }

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
                      padding: const EdgeInsets.only(bottom: 0),
                      //padding: EdgeInsets.symmetric(horizontal: 15),
                      child: Column(
                        children: [
                          Image(
                            image: (AssetImage(
                                'assets/images/logo_with_text.png')),
                            // image: AssetImage(
                            //     'assets/images/logo_with_new_color.svg'),
                            fit: BoxFit.cover,
                            color: MyThemes.primaryColor,
                            width: 250,
                          )
                        ],
                      )),
              Padding(
                //padding: const EdgeInsets.only(left:15.0,right: 15.0,top:0,bottom: 0),
                padding: EdgeInsets.symmetric(horizontal: 15),
                child: TextFormField(
                    controller: userNameController,
                    autofillHints: [AutofillHints.username],
                    validator: (value) => validateTextForm(value),
                    decoration: ThemedInputDecoration(
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
                    decoration: ThemedInputDecoration('Password', 'Password')),
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
                      var loginSnackbar = showNotification(
                          context, "Authenticating", MyThemes.primaryColor);
                      await supabase.auth
                          .signInWithPassword(
                        email: userNameController.text,
                        password: passwordController.text,
                      )
                          .then((res) async {
                        if (res.user?.aud == 'authenticated') {
                          Service.user.setUserName(userNameController.text);
                          loginSnackbar.close();
                          TextInput.finishAutofillContext();
                          saveDataOnDevice("email", userNameController.text);
                          saveDataOnDevice("password", passwordController.text);
                          Navigator.pushReplacementNamed(context, '/index');
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
      if (value.isEmpty) {
        return;
      }
      var customPrimaryColor = value[0];
      var customSecondaryColor = value[1];

      setState(() {
        MyThemes.primaryColor = parseColorStringToColor(customPrimaryColor!) ??
            MyThemes.primaryColor;
        MyThemes.secondaryColor =
            parseColorStringToColor(customSecondaryColor!) ??
                MyThemes.secondaryColor;
        // MyThemes.primaryColor = parseColorStringToColor(customPrimaryColor!) ??
        //     MyThemes.primaryColor;
        // secondaryColor = parseColorStringToColor(customSecondaryColor!);

        MyThemes.customTheme = MyThemes.getThemeData(
            parseColorStringToColor(customPrimaryColor!) ??
                MyThemes.primaryColor,
            parseColorStringToColor(customSecondaryColor!) ??
                MyThemes.secondaryColor);
      });
    });
  }
}
