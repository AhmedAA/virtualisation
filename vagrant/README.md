# General information

Information about Vagrant and different hypervisors.

# VirtualBox quirks

There are some things I personally like to setup, after the guest has been
installed. I will try to note them below here.

## Switching from PIIX4 to AHCI

The standard way that Vagrant will setup the virtual disk is with PIIX4. This
device type is old and it can result in the guest having really slow I/O.

To fix this, you can switch to AHCI emulation, which should speed up the guest.

Open the guest settings and navigate to `Storage`. Make sure to click on the
controller that has the virtual disk mounted, and change the `Type` from `PIIX4`
to `AHCI` in the dropdown menu.

## Distraction free UI

You can remove some of the most distracting elements from the UI. This can be
achieved by navigating to `User Interface` on the left. You can then tick off
the boxes you do not want to be shown when using your VM.

# Using libvirt instead of VirtualBox

Since libvirt/kvm/qemu can give more control and better performance, it can be
ideal to toy with it. I will try to walk through the installation process (on
archlinux), and full setup.

## Packages

In order to get up and running, you need to install the following packages
(names are as they are in arch repos):

```
ebtables dnsmasq bridge-utils iptables virt-manager qemu libvirt
```

## Preparing libvirt

After installing qemu and libvirt you need to add your user to some groups.

```bash
sudo gpasswd -a <username> kvm
sudo gpasswd -a <username> libvirt
```

In case the libvirt group does not exist, add it with:

```bash
groupadd libvirt
```

Also, in order to have shared folders working (in a way that allows the box to
write to synchronised folders), we need to modify `qemu.conf`. The file can be
found in `/etc/libvirt/qemu.conf`. The following lines need to be added:
```
user = "<USERNAME>"
group = "users"
dynamic_ownership = 1
```

Synced folders should now work.

## Starting libvirt

Start libvirt with the following commands:
```bash
sudo modprobe kvm_intel && sudo systemctl start libvirtd && sudo virsh net-start default
```

These commands will *load the kvm_intel* kernel module (use `kvm_amd` if you
have an amd processor). Then it will start the libvirtd service. Finally it will
start the "default" network. The "default" network should already be defined.
You can confirm by running `sudo virsh net-list --all`.

If it does not exist, then run: `sudo virsh net-define /usr/share/libvirt/networks/default.xml`

The above mentioned file might be somewhere else in your filesystem, depending
on version and distro.

## Vagrant and libvirt

In order to add libvirt as a provider for vagrant, we need to install a plugin.
We also need a plugin to transform boxes that use different providers, into the
provider we want (libvirt). Install the plugins using vagrant itself with:

```bash
vagrant plugin install vagrant-libvirt vagrant-mutate
```

Then convert the box to libvirt:

```bash
vagrant mutate kalilinux/rolling libvirt
vagrant box list # should show the box with libvirt as the provider
```

Then choose libvirt as the provider:
```bash
vagrant up --provider=libvirt
```

From the same directory as the Vagrantfile.

## Box management

In order to list boxes, the command from above can be run:
```bash
vagrant box list
```

In order to delete a specific box and version:
```bash
vagrant box remove kalilinux/rolling --box-version 2021.2.0 --provider libvirt
```

# Attaching USB devices - libvirt

https://virtuozzosupport.force.com/s/article/000017379

In order to attach a USB, list connected USB devices with: `lsusb`

You should then see the bus number and the device number. Then run:
```bash
lsusb -s busnumber:devicenumber -v | grep "id"
```
where *busnumber* and *devicenumber* is the _DECIMAL_ representation of the bus-
and devicenumber. You should then get a `idVendor` and `idProduct` field in your
terminal.

Create an xml file with following content:

```xml
<hostdev mode='subsystem' type='usb' managed='yes'>
  <source>
    <vendor id='0xNNNN'/>
    <product id='0xYYYY'/>
  </source>
</hostdev>
```

Save as something fitting. In our example `usb.xml`.

Finally connect the device with:
```bash
sudo virsh attach-device <box_name> </path/to/usb.xml>
```

And to disconnect:
```bash
sudo virsh detach-device <box_name> </path/to/usb.xml>
```

# Attach USB via terminal - VirtualBox

To attach a USB device through the terminal, we can use the `vboxmanage` tool.
The command looks like the following (run all commands on host):
```bash
VBoxManage controlvm  <uuid|vmname>  usbattach <uuid>|<address>
```

In order to get the different UUIDs and information use the following:
```bash
vboxmanage list usbhost # shows connected usb devices on the host

vboxmanage list runningvms # shows running guests
```

Take the UUIDs and insert in the command at the top. Your device should now be
connected to your VM.

To detach, simply run the first command again, but with `usbdetach` instead of
`usbattach`.

# Links
* https://computingforgeeks.com/complete-installation-of-kvmqemu-and-virt-manager-on-arch-linux-and-manjaro/
* https://jamielinux.com/docs/libvirt-networking-handbook/index.html
