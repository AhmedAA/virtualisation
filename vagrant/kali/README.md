# Kali Vagrant Box

This box is meant to install and setup tools that I think are nice to have, and
that are being used in most pentest engagements.

It is based on the official kali vagrant box from offensive security. As such it
already has nice network forwarding from the host and generally works quite
nicely.

The setup is completely opiniated.

# Why?

I do not like having to depend on what distro to install or repositories I have
access to. This way I can always have the same tools, no matter what I choose to
use.

# Goals

* Be able to install a wide variety of tools needed easily
* Have a seamless, or seemingly seamless, experience (meaning, I do not want to
  sit in a virtualbox GUI doing my work)
* Easily modifiable setup of boxes

# How it works

Clone this repo, copy the directory (kali directory only), modify the
Vagrantfile if needed, run `vagrant up`. Once done, run `vagrant ssh` and you
should now be inside the box over ssh.

Some things you might want to change in the Vagrantfile could be the packages
being installed, tools being cloned, shell setup, or something else. The file
itself should at least give an idea of how to modify and hack it yourself.

Another thing is the vagrant internals. You might want to map more folders into
the box (e.g. a working directory) or forward ports. The default setup from the
file has comments on how to achieve most workflows. This is just meant as a
base.

## Vagrant workflow

The workflow with vagrant is generally to:

* Start the box with `vagrant up` (must be run within the directory of the
  Vagrantfile or you can run `vagrant up <box-name>` if you already created the
  box)
* Stop the box with `vagrant halt` or `vagrant suspend` ([see here for
  differences](https://www.vagrantup.com/intro/getting-started/teardown.html))
* Completely nuke the box with `vagrant destroy`

I imagine myself having 2 boxes in `halt`/`shutdown` state at all times. One for
hack the box and one when I am actively working for a client.

A really cool thing about the entire Vagrant thing is also the seamless mapping
of folders into the boxes. This means I can have files on my local filesystem
that will be mapped into the boxes, so I can still edit files with my editor on
my host system seamlessly or interact with files inside the boxes from my host
system. This should result in only having to use the box for actual pentesting,
while still being able to achieve everything else from my host system.

## GUI?

If you want to forward certain GUI programs, such as burp or wireshak, you can
do so through X forwarding.

```bash
vagrant ssh -- -X wireshark
```

will run GUI wireshark on your host seamlessly. It will also block your terminal
though, but you can just run it as a background process if you need it.

## Terminal setup

Termite does not set the `TERM` env var properly, which messes up SSHing. In
order to fix this we can generate the required terminfo file on our host system,
and then move it over to the box.

From the host:

```bash
infocmp > termite.terminfo
```

This generates the terminfo file, and then from a shell on the box (or through
the vagrantfile):

```bash
tic -x /vagrant/termite.terminfo
```

I have experienced the same with kitty, so this fix will probably also work with
it.

# Caveats

Well, it is a virtual machine, meaning you do need to have the resources of it,
but I think it is running quite ok everything taken into consideration.

I have not tested hashcat or other heavier tools yet. I guess that is the real
test.
