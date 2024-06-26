import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { Transition } from '@headlessui/react'

import PrimaryButton from '@/components/PrimaryButton'
import axios, { csrf } from '@/lib/axios'
import { FormEventHandler, useState } from 'react'

interface ErrorMessages {
    rg_cbmerj?: string[]
    email?: string[]
    password?: string[]
    password_confirmation?: string[]
    current_password?: string[]
}

const UpdatePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [errors, setErrors] = useState<ErrorMessages>({})
    const [status, setStatus] = useState<string | null>(null)

    const submitForm: FormEventHandler = async event => {
        event.preventDefault()

        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .put('/api/password', {
                current_password: currentPassword,
                password: password,
                password_confirmation: passwordConfirmation,
            })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Atualizar Senha
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Garanta que sua conta esteja usando uma senha segura.
                </p>
            </header>

            <form onSubmit={submitForm} className="mt-6 space-y-6">
                {/* Current password */}
                <div>
                    <Label htmlFor="current_password">Senha atual</Label>
                    <Input
                        id="current_password"
                        type="password"
                        className="block mt-1 w-full"
                        onChange={event =>
                            setCurrentPassword(event.target.value)
                        }
                        required
                        autoComplete="current_password"
                    />

                    <InputError
                        messages={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label htmlFor="password">Nova senha</Label>
                    <Input
                        id="password"
                        type="password"
                        className="block mt-1 w-full"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="new_password"
                    />

                    <InputError messages={errors.password} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="password_confirmation">
                        Confirmar nova senha
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        className="block mt-1 w-full"
                        onChange={event =>
                            setPasswordConfirmation(event.target.value)
                        }
                        required
                        autoComplete="password_confirmation"
                    />

                    <InputError
                        messages={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton>Salvar</PrimaryButton>

                    {status === 'password-updated' && (
                        <Transition
                            show={true}
                            enterFrom="opacity-0"
                            leaveTo="opacity-0"
                            className="transition ease-in-out">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Savo com sucesso.
                            </p>
                        </Transition>
                    )}
                </div>
            </form>
        </section>
    )
}

export default UpdatePasswordForm
