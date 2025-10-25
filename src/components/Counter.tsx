interface CounterProps {
    days: number,
}

const Counter: React.FC<CounterProps> = (props: CounterProps) => {
    const { days: daysSinceFatality } = props
    return (
        <>
        <div style={styles.card}>
            <h1>
            {daysSinceFatality}
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