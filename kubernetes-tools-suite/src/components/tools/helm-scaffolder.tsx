"use client"

import React, { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FolderArchive, Download, FileCode } from "lucide-react"

export function HelmScaffolder() {
    const [config, setConfig] = useState({
        name: 'my-chart',
        description: 'A Helm chart for Kubernetes',
        appVersion: '1.0.0',
        version: '0.1.0',
        values: ''
    })

    const generateZip = async () => {
        const zip = new JSZip()
        const chartFolder = zip.folder(config.name)

        if (!chartFolder) return

        // 1. Chart.yaml
        const chartYaml = `apiVersion: v2
name: ${config.name}
description: ${config.description}
type: application
version: ${config.version}
appVersion: ${config.appVersion}
`
        chartFolder.file("Chart.yaml", chartYaml)

        // 2. values.yaml
        const defaultValues = `replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  className: ""
  annotations: {}
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific

resources: {}
  # limits:
  #   cpu: 100m
  #   memory: 128Mi
  # requests:
  #   cpu: 100m
  #   memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80
`
        chartFolder.file("values.yaml", config.values || defaultValues)

        // 3. Templates Folder
        const templates = chartFolder.folder("templates")
        if (templates) {
            templates.file("_helpers.tpl", `{{/*
Expand the name of the chart.
*/}}
{{- define "${config.name}.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "${config.name}.fullname" -}}
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
Common labels
*/}}
{{- define "${config.name}.labels" -}}
helm.sh/chart: {{ include "${config.name}.chart" . }}
{{ include "${config.name}.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "${config.name}.selectorLabels" -}}
app.kubernetes.io/name: {{ include "${config.name}.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
`)

            templates.file("deployment.yaml", `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "${config.name}.fullname" . }}
  labels:
    {{- include "${config.name}.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "${config.name}.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      {{- with .Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        {{- include "${config.name}.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
              protocol: TCP
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
`)

            templates.file("service.yaml", `apiVersion: v1
kind: Service
metadata:
  name: {{ include "${config.name}.fullname" . }}
  labels:
    {{- include "${config.name}.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "${config.name}.selectorLabels" . | nindent 4 }}
`)
        }

        // Generate Async
        const content = await zip.generateAsync({ type: "blob" })
        saveAs(content, `${config.name}-chart.zip`)
    }

    const handleChange = (field: string, value: string) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-primary" />
                        Chart Metadata
                    </CardTitle>
                    <CardDescription>Define the basics of your Helm chart</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Chart Name</Label>
                        <Input value={config.name} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input value={config.description} onChange={(e) => handleChange('description', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Chart Version</Label>
                            <Input value={config.version} onChange={(e) => handleChange('version', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>App Version</Label>
                            <Input value={config.appVersion} onChange={(e) => handleChange('appVersion', e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FolderArchive className="w-5 h-5 text-primary" />
                        Download
                    </CardTitle>
                    <CardDescription>Get your ready-to-use chart archive</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center items-center space-y-6">
                    <div className="text-center text-muted-foreground max-w-xs">
                        This will generate a standard .zip containing <code>Chart.yaml</code>, <code>values.yaml</code>, and a <code>templates/</code> directory with Deployment and Service manifests.
                    </div>
                    <Button size="lg" className="w-full max-w-xs gap-2" onClick={generateZip}>
                        <Download className="w-5 h-5" />
                        Download .zip
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
