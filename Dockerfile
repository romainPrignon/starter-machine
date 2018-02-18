FROM ubuntu:xenial

# boilerplate => abstract it away
RUN apt update
RUN apt install -y \
    curl \
    apt-transport-https \
    build-essential \
    python-software-properties \
    software-properties-common \
    language-pack-en-base
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt install -y nodejs

COPY package.json package.json
COPY framework.js framework.js
COPY provision.js provision.js

RUN npm install

# provision start here
RUN node provision.js

CMD [ "node" ]
