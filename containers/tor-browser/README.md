# How to

In order to run, do the following:

`docker build -t tor-browser .`

```bash
xhost +"local:docker@"
docker run -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix -v /dev/snd:/dev/snd -v /dev/shm:/dev/nloads:rw -v /etc/machine-id:/etc/machine-id:ro --name tor-browser --rm tor-browser
```
