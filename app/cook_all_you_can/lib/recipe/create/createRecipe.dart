// import 'package:cook_all_you_can/button.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';

// class Recipe extends StatefulWidget {
//   const Recipe({super.key});

//   @override
//   State<Recipe> createState() => _RecipeState();
// }

// // getListItems(List<Ingredient> items) {
// //   if (items.isEmpty) {
// //     return new ListTile(title: "test");
// //   } else {
// //     var listTiles;
// //     items.map((e) {
// //       listTiles = new ListTile(title: Text(e.name));
// //     });
// //     return listTiles;
// //   }
// // }

// class Ingredient {
//   String name;
//   String amount;
//   String unit;
//   Ingredient(this.name, this.amount, this.unit);
// }

// class _RecipeState extends State<Recipe> {
//   var ingredients = [];
//   List<Ingredient> items = [Ingredient("Ingredient 1", "", "")];
//   TextEditingController nameController = TextEditingController();

//   void addItemToList() {
//     setState(() {
//       items.insert(0, new Ingredient("test", "", ""));
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Material(
//       child: Center(
//         child: Shortcuts(
//           shortcuts: const <ShortcutActivator, Intent>{
//             // Pressing space in the field will now move to the next field.
//             SingleActivator(LogicalKeyboardKey.space): NextFocusIntent(),
//           },
//           child: FocusTraversalGroup(
//             child: Form(
//               autovalidateMode: AutovalidateMode.always,
//               onChanged: () {
//                 Form.of(primaryFocus!.context!)!.save();
//               },
//               child: Wrap(children: [
//                 Padding(
//                   padding: const EdgeInsets.all(8.0),
//                   child: ConstrainedBox(
//                     constraints: BoxConstraints.tight(const Size(200, 50)),
//                     child: TextFormField(
//                       decoration: InputDecoration(
//                         hintText: 'Hint Text',
//                         labelText: 'Name',
//                         border: OutlineInputBorder(),
//                       ),
//                       onSaved: (String? value) {
//                         debugPrint('Value for field saved as');
//                       },
//                     ),
//                   ),
//                 ),
//                 Padding(
//                   padding: const EdgeInsets.all(8.0),
//                   child: ConstrainedBox(
//                     constraints: BoxConstraints.tight(const Size(200, 50)),
//                     child: TextFormField(
//                       decoration: InputDecoration(
//                         hintText: 'Hint Text',
//                         labelText: 'preptime',
//                         border: OutlineInputBorder(),
//                       ),
//                       onSaved: (String? value) {
//                         debugPrint('Value for field saved as');
//                       },
//                     ),
//                   ),
//                 ),
//                 Padding(
//                   padding: EdgeInsets.all(20),
//                   child: TextField(
//                     controller: nameController,
//                     decoration: InputDecoration(
//                       border: OutlineInputBorder(),
//                       labelText: 'Contact Name',
//                     ),
//                   ),
//                 ),
//                 IconButton(
//                   icon: Icon(Icons.add_box),
//                   onPressed: () {
//                     addItemToList();
//                   },
//                 ),
//                 Expanded(
//                     child: ListView.builder(
//                         padding: const EdgeInsets.all(8),
//                         itemCount: items.length,
//                         itemBuilder: (BuildContext context, int index) {
//                           return Container(
//                             height: 50,
//                             margin: EdgeInsets.all(2),
//                             child: Center(
//                                 child: Text(
//                               '${items[index]}',
//                               style: TextStyle(fontSize: 18),
//                             )),
//                           );
//                         }))
//               ]),
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

//                 // ListView.builder(itemBuilder: (context, i) {
//                 //   return new ListTile();
//                 // })