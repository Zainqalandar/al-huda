'use client';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import z from 'zod';

interface Inputs {
	userEmail: string;
	password: string;
}

const Schema = z.object({
    userEmail: z.string()
    .email({message: 'Invalid Email Adress'})
    .min(2, {message: 'Email is required'}),
    password: z.string()
    .min(3, {message: 'Password must be at least 3 characters long'})


})

// Now implement the zod schema validation with react-hook-form in the form below





const Practice = () => {

    
	// const {
	// 	register,
	// 	watch,
	// 	handleSubmit,
	// 	formState: { errors },
	// } = useForm({
	// 	defaultValues: {
	// 		password: '',
	// 		userEmail: '',
	// 	},
	// });

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            userEmail: '',
            password: '',
        },
        resolver: async (data, context, options) => {
            try {
                const parsedData = Schema.parse(data);
                return { values: parsedData, errors: {} };
            } catch (error) {
                return { values: {}, errors: error.formErrors.fieldErrors };
            }
        },
    });

	const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

	console.log('watch: ', watch('userEmail'));
	console.log('errors password: ', errors.password);
	console.log('errors userEmail: ', errors.userEmail);

	return (
		<>
			<main className="mt-24 border-1 border-red-800 h-full max-w-4xl mx-auto p-6 space-y-10">
				<header className="text-center">
					<h1 className="text-2xl font-bold">
						Practice Forms — HTML + Tailwind
					</h1>
					<p className="text-sm text-gray-600">
						Copy each form into your React project to convert later
						with react-hook-form and zod.
					</p>
				</header>

				{/* <!-- 1. Login Form --> */}
				<section className="bg-white shadow rounded-lg p-6">
					<h2 className="text-lg font-medium mb-4">Login Form</h2>
					<form
						onSubmit={handleSubmit(onSubmit)}
						id="loginForm"
						className="space-y-4"
						noValidate
					>
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="loginEmail"
							>
								Email
							</label>
							<input
								id="loginEmail"
								// defaultValue={'Qalandar'}
								// message: 'Only alphabets are allowed'
								{...register('userEmail', {
									pattern: {
										value: /^[A-Za-z]+$/i,
										message: 'Only alphabets are allowed',
									},
                                    required: {
                                        value: true,
                                        message: 'Email is required',
                                    },
								})}
								type="email"
								placeholder="you@example.com"
								className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							/>
							<p
								className="mt-1 text-xs text-red-600"
								data-error-for="loginEmail"
							></p>
						</div>

						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="loginPassword"
							>
								Password
							</label>
							<input
								id="loginPassword"
								{...register('password', {
									required: true,
									minLength: 3,
								})}
								type="password"
								placeholder="Enter your password"
								className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							/>
							<p
								className="mt-1 text-xs text-red-600"
								data-error-for="loginPassword"
							></p>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center space-x-2 text-sm">
								<input
									type="checkbox"
									name="remember"
									className="h-4 w-4"
								/>
								<span>Remember me</span>
							</label>
							<a href="#" className="text-sm text-indigo-600">
								Forgot?
							</a>
						</div>

						<div>
							<button
								type="submit"
								className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
							>
								Log in
							</button>
						</div>
					</form>
				</section>
			</main>
		</>
	);
};

export default Practice;
