import pandas as pd
import matplotlib.pyplot as plt

def generate_report(data):
    df = pd.DataFrame(data)
    
    # Summary statistics
    summary = df.describe()
    print("Summary Statistics:\n", summary)
    
    # Plotting
    plt.figure(figsize=(10, 6))
    
    # Bar plot for metric counts
    plt.subplot(2, 1, 1)
    df["metric"].value_counts().plot(kind="bar")
    plt.title("Metric Counts")
    
    # Line plot for metric over time
    plt.subplot(2, 1, 2)
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        df.set_index('date', inplace=True)
        df['metric'].plot(kind='line')
        plt.title("Metric Over Time")
    
    plt.tight_layout()
    plt.savefig("report.pdf")
