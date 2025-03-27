export const parseDiveXml = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  const diveNodes = xmlDoc.getElementsByTagNameNS("*", "Dive");

  return Array.from(diveNodes).map((diveNode) => {
    const getText = (tag) =>
      diveNode.getElementsByTagNameNS("*", tag)[0]?.textContent;

    const samples = Array.from(
      diveNode.getElementsByTagNameNS("*", "Dive.Sample")
    ).map((s) => ({
      time: Number(s.getElementsByTagNameNS("*", "Time")[0]?.textContent),
      depth: Number(s.getElementsByTagNameNS("*", "Depth")[0]?.textContent),
      temperature: Number(
        s.getElementsByTagNameNS("*", "Temperature")[0]?.textContent
      ),
    }));

    const avgTemp =
      samples.length > 0
        ? Number(
          (
            samples.reduce((sum, s) => sum + (s.temperature || 0), 0) /
            samples.length
          ).toFixed(1)
        )
        : null;

    return {
      StartTime: getText("StartTime"),
      Duration: Number(getText("Duration")),
      MaxDepth: Number(getText("MaxDepth") || 0),
      AvgDepth: Number(getText("AvgDepth") || 0),
      SampleInterval: Number(getText("SampleInterval")) || null,
      Mode: Number(getText("Mode")) || 3,
      Source: getText("Source") || null,
      Note: getText("Note") || null,
      StartTemperature: Number(getText("StartTemperature")) || null,
      BottomTemperature: Number(getText("BottomTemperature")) || null,
      EndTemperature: Number(getText("EndTemperature")) || null,
      AltitudeMode: Number(getText("AltitudeMode")) || null,
      PersonalMode: Number(getText("PersonalMode")) || null,
      DiveNumberInSerie: Number(getText("DiveNumberInSerie")) || null,
      SurfaceTime: Number(getText("SurfaceTime")) || null,
      SurfacePressure: Number(getText("SurfacePressure")) || null,
      PreviousMaxDepth: parseFloat(getText("PreviousMaxDepth")) || null,
      DiveTime: Number(getText("DiveTime")) || null,
      Deleted: false,
      Weight: Number(getText("Weight")) || null,
      Weather: Number(getText("Weather")) || null,
      Visibility: Number(getText("Visibility")) || null,
      Software: getText("Software") || null,
      SerialNumber: getText("SerialNumber") || '',
      TimeFromReset: Number(getText("TimeFromReset")) || null,
      Battery: Number(getText("BatteryLevel")) || null,
      LastDecoStopDepth: getText("LastDecoStopDepth") !== undefined
        ? Number(getText("LastDecoStopDepth"))
        : null,

      AscentMode: Number(getText("AscentMode")) || 0,
      samples,
    };
  });
};


export const parseSmlDive = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  const headers = xmlDoc.getElementsByTagNameNS("*", "Header");

  return Array.from(headers).map((header) => {
    const getText = (parent, tag) =>
      parent.getElementsByTagNameNS("*", tag)[0]?.textContent;

    const deviceLog = header.parentNode;
    const sampleNodes = deviceLog.getElementsByTagNameNS("*", "Sample");

    const samples = Array.from(sampleNodes).map((s) => ({
      time: Number(s.getElementsByTagNameNS("*", "Time")[0]?.textContent),
      depth: s.getElementsByTagNameNS("*", "Depth")[0]
        ? Number(s.getElementsByTagNameNS("*", "Depth")[0].textContent)
        : undefined,
      temperature: s.getElementsByTagNameNS("*", "Temperature")[0]
        ? Number(s.getElementsByTagNameNS("*", "Temperature")[0].textContent) -
        273.15
        : undefined,
    }));

    const avgTemp =
      samples.length > 0
        ? Number(
          (
            samples.reduce((sum, s) => sum + (s.temperature || 0), 0) /
            samples.length
          ).toFixed(1)
        )
        : null;

    return {
      StartTime: getText(header, "DateTime"),
      Duration: Number(getText(header, "Duration")),
      MaxDepth: parseFloat(getText(header, "Max")),
      AvgDepth: parseFloat(getText(header, "Avg")),
      SampleInterval: Number(getText(header, "SampleInterval")) || null,
      Mode: 3,
      Source: getText(xmlDoc, "Name") || "SML File",
      Note: null,
      StartTemperature: avgTemp,
      BottomTemperature: avgTemp,
      EndTemperature: avgTemp,
      AltitudeMode: Number(getText(header, "Altitude")) || null,
      PersonalMode: Number(getText(header, "Conservatism")) || null,
      DiveNumberInSerie: Number(getText(header, "NumberInSeries")) || null,
      SurfaceTime: Number(getText(header, "SurfaceTime")) || null,
      SurfacePressure: Number(getText(header, "SurfacePressure")) || null,
      PreviousMaxDepth: parseFloat(getText(header, "PreviousDiveDepth")) || null,
      DiveTime: Number(getText(header, "Duration")) || null,
      Deleted: false,
      Weight: null,
      Weather: null,
      Visibility: null,
      Software: getText(xmlDoc, "SW") || null,
      SerialNumber: getText(xmlDoc, "SerialNumber") || '',
      TimeFromReset: null,
      Battery: Number(getText(header, "Battery")) || null,
      LastDecoStopDepth: null,
      AscentMode: 0,
      samples,
    };
  });
};
