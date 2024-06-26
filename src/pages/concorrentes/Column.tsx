'use client'

import { CellContext, ColumnDef } from '@tanstack/react-table'

export interface ConcorrenteInterface {
    data: {
        nome_guerra: string
        quadro: string
        graduacao_abreviacao: string
        obm_atual: string
        lotacao: string
        data_de_nascimento: string
        rg: string
        alistamento: string
        foto: string
    }
}

export const columns: ColumnDef<ConcorrenteInterface>[] = [
    //we can set normal fields like this
    {
        accessorKey: 'nome_guerra',
        header: 'Nome de Guerra',
    },
    {
        accessorKey: 'obm_atual',
        header: 'OBM Atual',
    },
    //
    {
        accessorKey: 'data_de_nascimento',
        header: () => <div className="text-right">Data de Nascimento</div>,
        cell: (props: CellContext<ConcorrenteInterface, unknown>) => {
            const { row } = props
            return (
                <div className="text-right">
                    {row.original.data.data_de_nascimento}
                </div>
            )
        },
    },
]
