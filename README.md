# Light Curves

This is a WIP for a webserver [#1](/../../issues/1) + webclient that lets users view
light curves for a particular star... for a particular night or a
year, and then maybe mark them as favorites...(?) adding this as a
enhancement feature, perhaps?? 

Please look at the [server](./server) and [client](./client) folders
for the respective things!

When the computer restarts, our aim is to have
[crontabs](https://crontab.guru/) restart both our frontend and
backend so we don't have to worry about it. However if that's not
setup, the following are the instructions to restart the backend and
frontend.

Since our frontend relies on the data from the frontend, we must first
make sure our backend REST api server is running on port 8000. To do
this you would have to start the docker container that was potentially
stopped after the restart. In order to run the docker container and
start the postgrest server please run the
(./backend/scripts/startDatabase.sh).

Once that is run, to start the frontend, please run (from the
(./client) folder the following: 
```yarn build && yarn start```

But in the most cases our frontend and backend are automatically
started by the cronjobs. To see our cronjobs please run 

```crontab -l```

To edit the cronjobs run

```crontab -u m23 -e```


To stop the backend/frontend processes once they're already running.
First get their process id by running 
```ss -tulp```

The process running at port 8000 is supposed to be the backend while
the one running at 2300 should be the frontend. The frontend will take
a while to start up because it first has to finish the build of the
site. To kill any of those processes note their process id (pid) then
run ```kill -9 <pid>```. This sends a shutdown signal to the process.
