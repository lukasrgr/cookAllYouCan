// ListTile(
//                         title: Text(e.name,
//                             style: Theme.of(context).textTheme.subtitle1),
//                       );


// // import 'package:flutter/material.dart';

// // void main() {
// //   runApp(const MyApp());
// // }

// // class MyApp extends StatelessWidget {
// //   // Stateless: iNhalt immer gleich
// //   const MyApp({super.key}); // Konstruktor

// //   // This widget is the root of your application.
// //   @override
// //   Widget build(BuildContext context) {
// //     return MaterialApp(
// //       title: 'Flutter Demo',
// //       theme: ThemeData(
// //         primarySwatch: Colors.blueGrey,
// //       ),
// //       home: const MyHomePage(title: 'Cook All You Can'),
// //     );
// //   }
// // }

// // class MyHomePage extends StatefulWidget {
// //   // Inhalt verändert sich
// //   const MyHomePage({super.key, required this.title});

// //   // This widget is the home page of your application. It is stateful, meaning
// //   // that it has a State object (defined below) that contains fields that affect
// //   // how it looks.

// //   // This class is the configuration for the state. It holds the values (in this
// //   // case the title) provided by the parent (in this case the App widget) and
// //   // used by the build method of the State. Fields in a Widget subclass are
// //   // always marked "final".

// //   final String title;

// //   @override
// //   State<MyHomePage> createState() => _MyHomePageState();
// // }

// // class _MyHomePageState extends State<MyHomePage> {
// //   int _counter = 0;

// //   void _incrementCounter() {
// //     setState(() {
// //       _counter++;
// //     });
// //   }

// //   @override
// //   Widget build(BuildContext context) {
// //     // This method is rerun every time setState is called, for instance as done
// //     // by the _incrementCounter method above.
// //     //
// //     // The Flutter framework has been optimized to make rerunning build methods
// //     // fast, so that you can just rebuild anything that needs updating rather
// //     // than having to individually change instances of widgets.
// //     return Scaffold(
// //       appBar: AppBar(
// //         // Here we take the value from the MyHomePage object that was created by
// //         // the App.build method, and use it to set our appbar title.
// //         title: Text(widget.title),
// //       ),
// //       body: Center(
// //         // Center is a layout widget. It takes a single child and positions it
// //         // in the middle of the parent.
// //         child: Column(
// //           // Column is also a layout widget. It takes a list of children and
// //           // arranges them vertically. By default, it sizes itself to fit its
// //           // children horizontally, and tries to be as tall as its parent.
// //           //
// //           // Invoke "debug painting" (press "p" in the console, choose the
// //           // "Toggle Debug Paint" action from the Flutter Inspector in Android
// //           // Studio, or the "Toggle Debug Paint" command in Visual Studio Code)
// //           // to see the wireframe for each widget.
// //           //
// //           // Column has various properties to control how it sizes itself and
// //           // how it positions its children. Here we use mainAxisAlignment to
// //           // center the children vertically; the main axis here is the vertical
// //           // axis because Columns are vertical (the cross axis would be
// //           // horizontal).
// //           mainAxisAlignment: MainAxisAlignment.center,
// //           children: <Widget>[
// //             const Text(
// //               'You have pushed the button this many times:',
// //             ),
// //             Text(
// //               '$_counter',
// //               style: Theme.of(context).textTheme.headline4,
// //             ),
// //           ],
// //         ),
// //       ),
// //       floatingActionButton: FloatingActionButton(
// //         onPressed: _incrementCounter,
// //         tooltip: 'Increment',
// //         child: const Icon(Icons.add),
// //       ), // This trailing comma makes auto-formatting nicer for build methods.
// //     );
// //   }
// // }


// class Recipe extends StatefulWidget {
//   const Recipe({super.key});

//   @override
//   State<Recipe> createState() => _RecipeState();
// }

// class _RecipeState extends State<Recipe> {
//   final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

//   @override
//   Widget build(BuildContext context) {
//     return Form(
//       key: _formKey,
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: <Widget>[
//           Row(children: <Widget>[
//             const Text("Recipe Title"),
//             TextFormField(
//               decoration: const InputDecoration(
//                 icon: Icon(Icons.person),
//                 hintText: 'What do people call you?',
//                 labelText: 'Name *',
//               ),
//               onSaved: (String? value) {
//                 // This optional block of code can be used to run
//                 // code when the user saves the form.
//               },
//               validator: (String? value) {
//                 return (value != null && value.contains('@'))
//                     ? 'Do not use the @ char.'
//                     : null;
//               },
//             )
//             // Padding(
//             //   padding: const EdgeInsets.symmetric(vertical: 13.0),
//             //   child: ElevatedButton(
//             //     onPressed: () {
//             //       // Validate will return true if the form is valid, or false if
//             //       // the form is invalid.
//             //       if (_formKey.currentState!.validate()) {
//             //         // Process data.
//             //       }
//             //     },
//             //     child: const Text('Submit'),
//             //   ),
//             // )
//           ])
//         ],
//       ),
//     );
//   }
// // }


//  return DataTable(
//       columns: const <DataColumn>[
//         DataColumn(
//           label: Expanded(
//             child: Text(
//               'Name',
//               style: TextStyle(fontStyle: FontStyle.italic),
//             ),
//           ),
//         ),
//         DataColumn(
//           label: Expanded(
//             child: Text(
//               'Age',
//               style: TextStyle(fontStyle: FontStyle.italic),
//             ),
//           ),
//         ),
//         DataColumn(
//           label: Expanded(
//             child: Text(
//               'Role',
//               style: TextStyle(fontStyle: FontStyle.italic),
//             ),
//           ),
//         ),
//       ],
//       rows: const <DataRow>[
//         DataRow(
//           cells: <DataCell>[
//             DataCell(Text('Sarah')),
//             DataCell(Text('19')),
//             DataCell(Text('Student')),
//           ],
//         ),
//         DataRow(
//           cells: <DataCell>[
//             DataCell(Text('Janine')),
//             DataCell(Text('43')),
//             DataCell(Text('Professor')),
//           ],
//         ),
//         DataRow(
//           cells: <DataCell>[
//             DataCell(Text('William')),
//             DataCell(Text('27')),
//             DataCell(Text('Associate Professor')),
//           ],
//         ),
//       ],
//     );

// Expanded(
//  child: ListView.builder(
//                   padding: const EdgeInsets.all(8),
//                   itemCount: ingredients.length,
//                   itemBuilder: (BuildContext context, int index) {
//                     return Container(
//                       height: 50,
//                       margin: EdgeInsets.all(2),
//                       color: msgCount[index] >= 10
//                           ? Colors.blue[400]
//                           : msgCount[index] > 3
//                               ? Colors.blue[100]
//                               : Colors.grey,
//                       child: Container(
//                           child: Row(children: <Widget>[
//                         Text('${ingredients[index].name}'),
//                         Text('${ingredients[index].name}')
//                       ])),
//                     );
//                   }))
// Container(
        //   child: Column(
        //     children: <Widget>[
        //       ListView.builder(
        //           padding: const EdgeInsets.all(8),
        //           itemCount: 3,
        //           itemBuilder: (BuildContext context, int index) {
        //             List<String> ingredients = ['Zutat 1'];
        //             List<TextField> textField = [];

        //             for (final ingredient in ingredients) {
        //               textField.add(TextField(
        //                   controller: nameController,
        //                   decoration: const InputDecoration(
        //                     border: OutlineInputBorder(),
        //                     labelText: 'Zutat',
        //                   )));
        //             }

        //             return Container(
        //               child: Column(
        //                 children: [...textField],
        //               ),
        //             );
        //           })
        //       // TextField(
        //       //     controller: nameController,
        //       //     decoration: const InputDecoration(
        //       //       border: OutlineInputBorder(),
        //       //       labelText: '',
        //       //     ))
        //       // ListView.builder(
        //       //   itemCount: 3,
        //       //   prototypeItem: ListTile(
        //       //     title: Text("Test"),
        //       //   ),
        //       //   itemBuilder: (context, index) {
        //       //     return ListTile(
        //       //       title: Text("Test"),
        //       //     );
        //       //   },
        //       // )
        //     ],
        //   ),
        // )
        // ListView.builder(
        //   itemCount: 3,
        //   prototypeItem: ListTile(
        //     title: Text("Test"),
        //   ),
        //   itemBuilder: (context, index) {
        //     return ListTile(
        //       title: Text("Test"),
        //     );
        //   },
        // )

        // ListView.builder(
            //     itemCount: 5,
            //     itemBuilder: (BuildContext context, int index) {
            //       return ListTile(
            //           leading: const Icon(Icons.list),
            //           trailing: const Text(
            //             "GFG",
            //             style: TextStyle(color: Colors.green, fontSize: 15),
            //           ),
            //           title: Text("List item $index"));
            //     }),
            // Container(
            //   child: Column(
            //     children: [
            //       ListView.builder(
            //           itemBuilder: (BuildContext context, int index) {
            //         var textFields = TextField(
            //             controller: nameController,
            //             decoration: const InputDecoration(
            //               border: OutlineInputBorder(),
            //               labelText: 'Vorbereitungszeit [min]',
            //             ));
            //         return textFields;
            //       })
            //     ],
            //   ),
            // ),
            // ListView.builder(
            //   itemBuilder: (BuildContext context, int index) {
            //     return Container(
            //       child: Row(
            //         children: [
            //           Text("Personen"),
            //           Slider(
            //             value: _currentSliderValue,
            //             max: 5,
            //             label: _currentSliderValue.round().toString(),
            //             onChanged: (double value) {
            //               setState(() {
            //                 _currentSliderValue = value;
            //               });
            //             },
            //           )
            //         ],
            //       ),
            //     );
            //   },
            // )
            //   var textFields;

            //   // for(){

            //   // }
            //   TextField(
            //     controller: nameController,
            //     decoration: const InputDecoration(
            //       border: OutlineInputBorder(),
            //       labelText: 'Zutat 1',
            //     ),
            //   );
            //   FloatingActionButton(onPressed: () => {});
            // })

            // DataTable(columns: const <DataColumn>[
            //   DataColumn(
            //     label: Expanded(
            //       child: Text(
            //         'Titel',
            //         style: TextStyle(fontStyle: FontStyle.italic),
            //       ),
            //     ),
            //   ),
            // ], rows: <DataRow>[]
            //     DataRow(cells: <Widget>[
            //     DataCell()]

            //  ListView.builder(
            // padding: const EdgeInsets.all(8),
            // itemBuilder: (BuildContext context, int index) {
            // return DataCell(const Text("Test"));
            // }),
            // ),
            // Expanded(
            // child:
            // ListView.builder(
            //     padding: const EdgeInsets.all(8),
            //     itemBuilder: (BuildContext context, int index) {
            //       var ingredients = [];
            //       Widget textField;
            //       List<DataRow> rows = [];

            //       // for (final ingredient in ingredients) {
            //       //   rows.add(DataRow(cells: [DataCell(Text("Test"))]));
            //       // }

            //       textField = DataTable(
            //           columns: const <DataColumn>[], rows: <DataRow>[]);

            //       return textField;
            //     })

            // ListView.builder(
            //     itemBuilder: (BuildContext context, int index) {
            //   for (final ingredient in ingredients) {
            //     textField
            //         .add(DataRow(cells: [DataCell(Text("Test"))]));
            //   }
            //   return Container(child: Column(
            //     children: [...textField],
            //   ),);
            // })
            // List<String> ingredients = ['Zutat 1'];
            // List<TextField> textField = [];

            // for (final ingredient in ingredients) {
            //   textField.add(TextField(
            //       controller: nameController,
            //       decoration: const InputDecoration(
            //         border: OutlineInputBorder(),
            //         labelText: 'Zutat',
            //       )));
            // }
            // return Container();
            // return TextField(
            //     controller: nameController,
            //     decoration: const InputDecoration(
            //       border: OutlineInputBorder(),
            //       labelText: 'Zutat',
            //     ));
            // }))

            // return Container(
            //   child: Column(
            //     children: [...textField],
            //   ),
            // );
            // })