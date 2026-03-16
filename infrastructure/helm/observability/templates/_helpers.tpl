{{/*
Observability chart helper templates.
*/}}

{{- define "observability.namespace" -}}
{{ .Values.namespace }}
{{- end -}}

{{- define "observability.labels" }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: luckyplans-observability
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end -}}

{{- define "observability.selectorLabels" -}}
app.kubernetes.io/part-of: luckyplans-observability
{{- end -}}
