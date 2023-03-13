import 'package:flutter/material.dart';

const primaryColor = Color(0xFF81C784);
const secondaryColor = Colors.black;

List<DropdownMenuItem<String>> get dropdownItems {
  List<DropdownMenuItem<String>> menuItems = [
    DropdownMenuItem(child: Text("g"), value: "Gramm"),
    DropdownMenuItem(child: Text("Stk"), value: "Stück"),
    DropdownMenuItem(child: Text("l"), value: "Liter"),
  ];
  return menuItems;
}

/// Validator for createRecipe
String? validateTextForm(String? value) {
  if (value == null || value.isEmpty) {
    return 'Bitte ausfüllen';
  }
  return null;
}

ScaffoldFeatureController<SnackBar, SnackBarClosedReason> showNotification(
    BuildContext context, String message) {
  late AnimationController controller;
  return ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: primaryColor,
      content: Row(
        children: [
          Text(message,
              style:
                  // message,
                  TextStyle(
                color: secondaryColor,
              )),
          Spacer(),
          CircularProgressIndicator()
        ],
      ),
    ),
  );
}

@override
Widget buildUnitDropdownMenu(BuildContext context, dynamic dropdownValue,
    List<String> list, Function setState) {
  return Flexible(
      flex: 1,
      child: DropdownButton<String>(
        value: dropdownValue,
        elevation: 16,
        style: const TextStyle(fontSize: 16),
        underline: Container(
          height: 2,
          width: 10,
        ),
        onChanged: (String? value) {
          // This is called when the user selects an item.
          setState(() {
            dropdownValue = value!.toString();
          });
        },
        items: list.map((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
      ));
}

confirmRemovePopUp(BuildContext context) async {
  var future;
  return showDialog<bool>(
    context: context,
    barrierDismissible: false, // user must tap button!
    builder: (BuildContext context) {
      return AlertDialog(
        content: SingleChildScrollView(
          child: ListBody(
            children: const <Widget>[
              Text('Willst du das Rezept wirklich entfernen?'),
            ],
          ),
        ),
        actions: <Widget>[
          Row(
            children: [
              Column(
                children: [
                  TextButton(
                    child: const Text('Ja'),
                    onPressed: () {
                      Navigator.of(context).pop(true);
                    },
                  ),
                ],
              ),
              Spacer(),
              Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    child: const Text('Nein'),
                    onPressed: () {
                      Navigator.of(context).pop(false);
                    },
                  ),
                ],
              )
            ],
          )
        ],
      );
    },
  );
}
