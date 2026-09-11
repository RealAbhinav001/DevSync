let instanceIo = null

const setIo = (io) => {
    instanceIo = io
}

const getIo = () => {
    if (instanceIo === null) {
        throw new Error("Instance Io not found")
    }

    return instanceIo
}

module.exports = {
    setIo,
    getIo
}
