const baseUrl = 'http://localhost:8080/api/apps';

const urlMap = {
  "Cloud Storage Manager": "https://aws.amazon.com/s3",
  "Data Pipeline Orchestrator": "https://airflow.apache.org",
  "Identity Provider": "https://auth0.com",
  "Log Aggregator": "https://www.elastic.co/elastic-stack",
  "API Gateway": "https://aws.amazon.com/api-gateway",
  "Billing Dashboard": "https://aws.amazon.com/billing",
  "ML Model Server": "https://www.tensorflow.org/tfx/guide/serving",
  "Customer Portal": "https://reactjs.org",
  "Alerting Engine": "https://prometheus.io/",
  "Container Registry": "https://hub.docker.com/"
};

async function updateApps() {
  console.log("Fetching applications from backend...");
  const res = await fetch(`${baseUrl}?size=100`);
  const data = await res.json();
  
  if (!data.content || data.content.length === 0) {
      console.log("No applications found to update.");
      return;
  }

  let updatedCount = 0;
  for (const app of data.content) {
    if (!app.url) {
      let mappedUrl = urlMap[app.name] || "https://example.com/catalog/" + app.appId;
      console.log(`Updating '${app.name}' with URL: ${mappedUrl}`);
      
      const updateData = {
        name: app.name,
        category: app.category,
        version: app.version,
        description: app.description,
        tags: app.tags,
        url: mappedUrl,
        dependencyIds: app.dependencies ? app.dependencies.map(d => d.appId) : []
      };
      
      const putRes = await fetch(`${baseUrl}/${app.appId}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(updateData)
      });
      
      if (putRes.ok) {
          updatedCount++;
          console.log(`Successfully updated ${app.name}.`);
      } else {
          console.error(`Failed to update ${app.name}: ${putRes.statusText}`);
      }
    }
  }
  
  console.log(`\nFinished executing. Total applications updated: ${updatedCount}`);
}

updateApps().catch(console.error);
