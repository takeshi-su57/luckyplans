{{/*
Expand the name of the chart.
*/}}
{{- define "luckyplans.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
Truncates to 63 chars because Kubernetes DNS labels have that limit.
*/}}
{{- define "luckyplans.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Chart label value.
*/}}
{{- define "luckyplans.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels applied to every resource.
*/}}
{{- define "luckyplans.labels" -}}
helm.sh/chart: {{ include "luckyplans.chart" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: luckyplans
{{- end }}

{{/*
Selector labels scoped to a component.
Usage: {{ include "luckyplans.selectorLabels" (dict "component" "api-gateway" "ctx" .) }}
*/}}
{{- define "luckyplans.selectorLabels" -}}
app.kubernetes.io/name: {{ .component }}
app.kubernetes.io/instance: {{ .ctx.Release.Name }}
{{- end }}

{{/*
Full component labels (common + selector).
Usage: {{ include "luckyplans.componentLabels" (dict "component" "api-gateway" "ctx" .) }}
*/}}
{{- define "luckyplans.componentLabels" -}}
{{ include "luckyplans.labels" .ctx }}
{{ include "luckyplans.selectorLabels" . }}
{{- end }}

{{/*
Namespace — always luckyplans regardless of release name.
*/}}
{{- define "luckyplans.namespace" -}}
{{- .Values.namespace | default "luckyplans" }}
{{- end }}

{{/*
Renders a full image reference.
Usage: {{ include "luckyplans.image" (dict "registry" .Values.image.registry "repository" .Values.apiGateway.image.repository "tag" .Values.apiGateway.image.tag) }}
*/}}
{{- define "luckyplans.image" -}}
{{- if .registry -}}
{{- printf "%s/%s:%s" .registry .repository .tag -}}
{{- else -}}
{{- printf "%s:%s" .repository .tag -}}
{{- end -}}
{{- end }}
