We're importing the data for our database from a google spreadsheet.
https://docs.google.com/spreadsheets/d/1Vv8_6IX_y6Wg6FuHJpgUVYnhiZ4dBOq8535wMoCXYP4

Please note that the date format has to be in YYYY-MM-DD format!
Also, few more things to note:

When going inside the databse, please make sure that the search path
is set to api. This can be donw with the command:

```
SET search_path TO api;
```

You can verify that you've set the `search_path` correctly by running
```
SHOW search_path;
```


Afterwards, you must also be in the correct schema to perform the
database operations.

When connecting to database as root user, to do database INSERT,
DELETE tasks, we would use the user called postgres. Please don't be
confused that both the root user name and the database that we have
are named `postgres`. However, doing READ only tasks to the database
should be done with the user/role called `reader`. This role is also
provided the login permission, so connecting to our database, and
doing any READ is to be done with this `reader` role. There's no
password for this rule.

If any new table is created in the database and the reader wants to
have access to it, then the admin must provide a read access to this
reader user on that table. While logged in as the root user, you could
run the following command in the databse:
```
GRANT USAGE ON SCHEMA api TO reader;
GRANT SELECT ON ALL TABLES IN SCHEMA api TO reader;
```
It looks like this command must be re-reun after new relations are
added.

To set a role to a different role temporarily, you could run 
`SET ROLE role_name;`. In order to view all the available role names
you could do `select * from pg_roles`

To view the curren user and role for the session use
```
SELECT session_user, current_user;
```
