const Counter: React.FC = () => {
    return (
        <>
        <div style={styles.card}>
            <h1>
            5
            </h1>
            <h1>Days without a fatality on San Diego's roads</h1>
        </div>
        </>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    padding: '2em'
  },
};

export default Counter