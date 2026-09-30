# Dockerfiles

Dockerfiles for different applications/utilities

## Make GUI applications work

In order to have applications start on your running X server, you need to do the
following:

`xhost +"local:docker@"`

This should allow the docker daemon to draw to the running X server.
