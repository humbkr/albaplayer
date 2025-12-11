## docker cheat sheet
##### build and tag
For x64:  
`docker build -t <user>/<app>:<tag> .`  

For apple silicon and arm64:  
`docker buildx build --platform linux/arm64 -t <user>/<app>:<tag> .`


##### run image
`docker run -it -p <host_port>:<container_port> <user>/<app>:<tag>`  

