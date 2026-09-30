# Pi agent sandbox

A complete container isolating the Pi harness in a nono sandbox.

## Building

Before building, double check the Containerfile to include things you like
(extra packages, etc). Also, check the `models.json` file for Pi to ensure you
have configured it properly.

Then build the container with:

```shell
podman build -t pi-agent .
# OR
docker build -t pi-agent -f Containerfile .
```

This should build the entire thing for you.

## Running

Run the container with:

```shell
podman run -it --name pi pi-agent
```

If you are hosting your model on your own `localhost`, but not on all interfaces
(0.0.0.0), then you need to add a `--network host` flag to the above command.

Create a directory you want to work from (for example `mkdir dev && cd dev`).

And start Pi in a sandbox with:

```shell
nono run --profile pi -- pi
# OR (if running with local LLM)
nono run --profile pi -- env -u NO_PROXY -u no_proxy pi
```

Happy hacking :)
