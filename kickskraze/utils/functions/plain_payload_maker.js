const plain_payload_maker = (user) => {
    let payload = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
    return payload;
}

export default plain_payload_maker;