import 'dart:convert';

import 'package:cook_all_you_can/shared/database/table.dart';
import 'package:flutter/cupertino.dart';
import 'package:mysql_client/mysql_client.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

// class Database {
//   static final conn = MySQLConnectionPool(
//       host: '192.168.178.107',
//       port: 3306,
//       userName: 'test1',
//       password: 'test1',
//       maxConnections: 10,
//       databaseName: 'cookallyoucan', // optional,
//       secure: false);

//   static Future<void> insertIntoTable(Table table) async {
//     await selectFrom(table).then((value) {
//       if (value.isNotEmpty) return;
//     });
//     // TODO: bad practice
//     List<String> values = [];
//     for (var element in table.props.keys) {
//       values.add('?');
//     }
//     var stmt = await conn.prepare(
//         """INSERT INTO ${table.TABLENAME}  ${table.props.keys} VALUES (${values.toString().replaceFirst('[', '').replaceFirst(']', '')})""");

//     stmt.execute([...table.props.values]);
//   }

//   static Future<Map<int, Map<String, String?>>> selectFrom(Table table) async {
//     // TODO: probably search for library
//     var map = <int, Map<String, String?>>{};

//     await conn.execute(
//         """SELECT ${table.props.keys} FROM ${table.TABLENAME}""").then((value) {
//       for (var i = 0; i < value.rows.length; i++) {
//         map[i] = {
//           value.rows.elementAt(i).assoc().entries.first.key:
//               value.rows.elementAt(i).assoc().entries.first.value
//         };
//       }
//     });

//     return map;
//   }
// }

class Database {
  final supabase = Supabase.instance.client;

  Future<void> insertIntoTable(DatabaseTable table) async {
    // String insertString = json.encode(table.props);

    // await supabase.from(table.TABLENAME).insert(insertString);
  }

  Future<Map<int, Map<String, String?>>> selectFrom(
      DatabaseTable table, List<String> columns) async {
    // TODO: probably search for library
    var map = <int, Map<String, String?>>{};
    print("here");
    // print(table.props);

    PostgrestList list =
        await supabase.from(table.TABLENAME).select(columns.join(','));

    // TODO: resolve PostgresList ot PostgrestMap in a stream
    for (var i = 0; i < list.length; i++) {
      var element = list[i].entries;
      print(element.first.value);
      map[i] = {element.first.key.toString(): element.first.value.toString()};
    }

    return map;
  }

  // Future<Map<String, String?>> where(
  //   Future<Map<int, Map<String, String?>>> result,
  //   Map<String, String> condition) {
  //     supabase.
  // }
}
