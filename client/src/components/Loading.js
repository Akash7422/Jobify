const Loading = ({ center }) => {
    return (
        <div
            className={center ? "loading loading-center" : "loading"}
            style={{ marginTop: "175px" }}></div>
    )
}

export default Loading
