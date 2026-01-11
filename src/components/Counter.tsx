interface CounterProps {
    days: number,
}

const Counter: React.FC<CounterProps> = (props: CounterProps) => {
    const { days: numDays } = props
    const dayText = numDays === 1 ? 'Day' : 'Days'
    return (
        <>
        <div style={styles.card}>
            <h1>
            {numDays}
            </h1>
            <h1>{dayText} without a casualty on San Diego's roads</h1>
        </div>
        </>
    )
}

// AIzaSyAsf6_3yTJoVZeAFx2aQxxxMe0QQjRE-Ao

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    padding: '2em'
  },
};

export default Counter