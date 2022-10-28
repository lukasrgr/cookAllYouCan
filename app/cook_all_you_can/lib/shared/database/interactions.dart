import 'package:cook_all_you_can/shared/database/table.dart';
import 'package:mysql_client/mysql_client.dart';

class Database {
  static final conn = MySQLConnectionPool(
      host: '192.168.178.107',
      port: 3306,
      userName: 'test1',
      password: 'test1',
      maxConnections: 10,
      databaseName: 'cookallyoucan', // optional,
      secure: false);

  static Future<void> insertIntoTable(Table table) async {
    await selectFrom(table).then((value) {
      if (value.isNotEmpty) return;
    });
    // TODO: bad practice
    List<String> values = [];
    for (var element in table.props.keys) {
      values.add('?');
    }
    var stmt = await conn.prepare(
        """INSERT INTO ${table.TABLENAME}  ${table.props.keys} VALUES (${values.toString().replaceFirst('[', '').replaceFirst(']', '')})""");

    stmt.execute([...table.props.values]);
  }

  static Future<Map<int, Map<String, String?>>> selectFrom(Table table) async {
    // TODO: probably search for library
    var map = <int, Map<String, String?>>{};

    await conn.execute(
        """SELECT ${table.props.keys} FROM ${table.TABLENAME}""").then((value) {
      for (var i = 0; i < value.rows.length; i++) {
        map[i] = {
          value.rows.elementAt(i).assoc().entries.first.key:
              value.rows.elementAt(i).assoc().entries.first.value
        };
      }
    });

    return map;
  }
}
