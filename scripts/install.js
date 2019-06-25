module.exports = function * () {
    yield `apt install -y unzip`
    yield `wget -q https://releases.hashicorp.com/packer/1.3.5/packer_1.3.5_linux_amd64.zip -O packer_1.3.5_linux_amd64.zip`
    yield `unzip packer_1.3.5_linux_amd64.zip -d /tmp`
    yield `rm -rf packer_1.3.5_linux_amd64.zip`
}