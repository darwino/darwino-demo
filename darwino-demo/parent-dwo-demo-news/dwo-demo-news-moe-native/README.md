# Darwino MOE port

Please download and install dwo-moe-port from the https://github.com/migeran/dwo-moe-port

### Open in the Eclipse
```sh
$ git clone https://github.com/migeran/darwino-demo -b migeran
$ cd darwino-demo/darwino-demo/parent-dwo-demo-news/dwo-demo-news-moe-native
$ mvn prepare-package
```

In Eclipse you need to do the following:

Preferences... -> Java -> Installed JREs -> Edit...
Add to the Default VM arguments `-Dmaven.multiModuleProjectDirectory=$M2_HOME`

- Import as Existing Maven Projects
- Run/Debug as Multi-OS Engine iOS Application