import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../recipe/recipes.dart';
import '../recipe/showRecipe.dart';
import 'database/table.dart';

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
    BuildContext context, String message,
    [Color? bgcolor]) {
  late AnimationController controller;
  return ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: bgcolor ?? primaryColor,
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

/* @deprecated */
WholeRecipeContent dummyWholeRecipe = new WholeRecipeContent(
    new Recipe("", 0, 0, 0, 0), [], new RecipeManual(0, 0), [], []);

List<String> unitsForIngredient = <String>[
  'g',
  'ml',
  'Stück',
  'Prise',
  'TL',
  'EL',
  'Dose',
  'Msp',
  'Packung',
  'Scheibe',
  'Buendel'
];
List<String> defaultUnit = ['g'];

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

createPopUp() async {
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
                  // Navigator.of(context).pop(true);
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
                  // Navigator.of(context).pop(false);
                },
              ),
            ],
          )
        ],
      )
    ],
  );
}

Future<List<Recipe>> updateRecipes() async {
  final supabase = Supabase.instance.client;
  List<Recipe> recipes = [];
  await supabase
      .from(RecipeTable().TABLENAME)
      .select('name, prep_time, number_of_people, id')
      .then((value) => {
            for (var i = 0; i < value.length; i++)
              {
                recipes.add(
                  Recipe(
                      value[i]['name'].toString(),
                      value[i]['prep_time'] != null
                          ? value[i]['prep_time'].toString() + ' Min.'
                          : '-',
                      value[i]['rating'] != null
                          ? value[i]['rating'].toString()
                          : '-',
                      value[i]['number_of_people'],
                      value[i]['id']),
                )
              }
          })
      .whenComplete(() {
    return new Future.value(recipes);
  });

  return new Future.value(recipes);
}

createBasicAlertDialog(BuildContext context, String text) {
  // Scaffold is a layout for
  // the major Material Components.
  return showDialog<bool>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(text),
              ],
            ),
          ),
          actions: <Widget>[
            Row(
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    TextButton(
                      child: const Text('Nein'),
                      onPressed: () {
                        Navigator.of(context).pop(false);
                      },
                    ),
                  ],
                ),
                Spacer(),
                Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      child: const Text('Ja'),
                      onPressed: () {
                        Navigator.of(context).pop(true);
                      },
                    ),
                  ],
                ),
              ],
            )
          ],
        );
      });
}

class CheckboxFormField extends FormField<bool> {
  CheckboxFormField(
      {Widget? title,
      FormFieldSetter<bool>? onSaved,
      FormFieldValidator<bool>? validator,
      bool initialValue = false,
      bool autovalidate = false})
      : super(
            onSaved: onSaved,
            validator: validator,
            initialValue: initialValue,
            builder: (FormFieldState<bool> state) {
              return CheckboxListTile(
                dense: state.hasError,
                title: title,
                value: state.value,
                onChanged: state.didChange,
                subtitle: state.hasError
                    ? Builder(
                        builder: (BuildContext context) => Text(
                          state.errorText ?? "",
                          style: TextStyle(
                              color: Theme.of(context).colorScheme.error),
                        ),
                      )
                    : null,
                controlAffinity: ListTileControlAffinity.leading,
              );
            });
}
