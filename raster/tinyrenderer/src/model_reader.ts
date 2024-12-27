export type Vertex = [number, number, number]
export type Face = [number, number, number]
export type Model = { vertices: Vertex[]; faces: Face[] }

export function readModelFromRaw(rawData: string): Model {
    // parse file for vertices and faces

    let verts: Vertex[] = []
    let faces: Face[] = []
    rawData.split('\n').forEach((line) => {
        let data = line.split(' ')

        // catalog all vertices
        if (data[0] === 'v') {
            verts.push(data.slice(1, 4).map((v) => parseFloat(v)) as Vertex)
        }

        // faces are indices to vertices
        if (data[0] === 'f') {
            let face = data.slice(1, 4).map((vertex) => parseInt(vertex.split('/')[0])) as Face
            faces.push(face)
        }
    })

    return {
        vertices: verts,
        faces: faces,
    }
}
