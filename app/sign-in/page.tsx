"use client";

import { toast } from "@/hooks/use-toast";
import { createAccount, login } from "@/lib/apiClient";
import { CancelAbortMsg } from "@/lib/defaults";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import LoadingSpinner from "../components/Loader/LoadingSpinner";
import SigninLayout from "../components/SigninLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { TypographyH3 } from "../components/ui/typography";

const LoginForm = ({
    setShowForm,
}: {
    setShowForm: (form: string) => void;
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const handleFormChange = (form: string) => {
        setShowForm(form);
        reset();
    };
    const onSubmit = handleSubmit((data: FieldValues) => {
        const { email, password } = data as {
            email: string;
            password: string;
        };

        setLoading(true);
        login({ email, password })
            .then(() => {
                const path = localStorage.getItem("prevPath") || "/";
                localStorage.removeItem("prevPath");
                router.push(path);
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    });
    return (
        <form
            className="flex flex-col gap-6 w-full border border-muted/60 p-10 rounded-lg bg-background/90 backdrop-blur-sm"
            onSubmit={onSubmit}
        >
            <div>
                <TypographyH3>Login</TypographyH3>
            </div>
            <div className="flex flex-col gap-4">
                <Input
                    {...register("email", { required: "Email is required" })}
                    placeholder="Email"
                    type="email"
                    className={`border-muted/60 bg-transparent ${
                        errors.email ? "border-destructive" : ""
                    }`}
                />
                {errors?.email && (
                    <span className="text-red-600 text-sm">
                        {errors.email.message?.toString()}
                    </span>
                )}
                <Input
                    {...register("password", {
                        required: "Password is required",
                    })}
                    placeholder="Password"
                    type="password"
                    className={`border-muted/60 bg-transparent ${
                        errors.password ? "border-destructive" : ""
                    }`}
                />
                {errors.password && (
                    <span className="text-red-600 text-sm">
                        {errors.password.message?.toString()}
                    </span>
                )}
            </div>
            <Button
                type="submit"
                variant={"default"}
                className="flex justify-center items-center gap-2"
                disabled={loading}
            >
                {loading && <LoadingSpinner />}
                <span>Login</span>
            </Button>
            <span
                className="text-sky-600 cursor-pointer text-sm"
                onClick={() => handleFormChange("create")}
            >
                Create an account?
            </span>
        </form>
    );
};

const CreateAccountForm = ({
    setShowForm,
}: {
    setShowForm: (form: string) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const handleFormChange = (form: string) => {
        setShowForm(form);
        reset();
    };
    const onSubmit = handleSubmit((data: FieldValues) => {
        const { first_name, last_name, email, password, confirmPassword } =
            data as {
                first_name: string;
                last_name: string;
                email: string;
                password: string;
                confirmPassword: string;
            };
        setLoading(true);
        createAccount({ first_name, last_name, email, password, confirmPassword })
            .then(() => {
                const path = localStorage.getItem("prevPath") || "/";
                localStorage.removeItem("prevPath");
                router.push(path);
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    });
    return (
        <form
            className="flex flex-col gap-6 w-full border border-muted/60 p-10 rounded-lg bg-background/90 backdrop-blur-sm"
            onSubmit={onSubmit}
        >
            <div>
                <TypographyH3>Create Account</TypographyH3>
            </div>
            <div className="flex flex-col gap-4">
                <Input
                    placeholder="First Name"
                    className={`border-muted/60 bg-transparent ${
                        errors.first_name ? "border-destructive" : ""
                    }`}
                    {...register("first_name", {
                        required: "First Name is required",
                    })}
                />
                {errors.first_name && (
                    <span className="text-red-600 text-sm">
                        {errors.first_name.message?.toString()}
                    </span>
                )}
                <Input
                    placeholder="Last Name"
                    className={`border-muted/60 bg-transparent ${
                        errors.last_name ? "border-destructive" : ""
                    }`}
                    {...register("last_name", {
                        required: "Last Name is required",
                    })}
                />
                {errors.last_name && (
                    <span className="text-red-600 text-sm">
                        {errors.last_name.message?.toString()}
                    </span>
                )}
                <Input
                    placeholder="Email"
                    type="email"
                    className={`border-muted/60 bg-transparent ${
                        errors.email ? "border-destructive" : ""
                    }`}
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Enter a valid email",
                        },
                    })}
                />
                {errors.email && (
                    <span className="text-red-600 text-sm">
                        {errors.email.message?.toString()}
                    </span>
                )}
                <Input
                    placeholder="Password"
                    type="password"
                    className={`border-muted/60 bg-transparent ${
                        errors.password ? "border-destructive" : ""
                    }`}
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                    })}
                />
                {errors.password && (
                    <span className="text-red-600 text-sm">
                        {errors.password.message?.toString()}
                    </span>
                )}
                <Input
                    placeholder="Confirm Password"
                    type="password"
                    className={`border-muted/60 bg-transparent ${
                        errors.confirmPassword ? "border-destructive" : ""
                    }`}
                    {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) => {
                            if (value !== watch("password", "")) {
                                return "Passwords don't match";
                            }
                        },
                    })}
                />
                {errors.confirmPassword && (
                    <span className="text-red-600 text-sm">
                        {errors.confirmPassword.message?.toString()}
                    </span>
                )}
            </div>
            <Button
                type="submit"
                variant={"default"}
                className="flex justify-center items-center gap-2"
                disabled={loading}
            >
                {loading && <LoadingSpinner />}
                <span>Create</span>
            </Button>
            <span
                className="text-sky-600 cursor-pointer text-sm"
                onClick={() => handleFormChange("login")}
            >
                Already have an account?
            </span>
        </form>
    );
};

const Page = () => {
    const [showForm, setShowForm] = useState<string>("login");
    const [animate, setAnimate] = useState<boolean>(false);

    const handleFormChange = (form: string) => {
        setAnimate(true);
        setTimeout(() => {
            setShowForm(form);
            setAnimate(false);
        }, 300);
    };

    return (
        <SigninLayout>
            <div
                className={cn(
                    "max-w-md w-full transition-all duration-300",
                    animate
                        ? "opacity-0 -translate-y-5"
                        : "opacity-100 translate-y-0"
                )}
            >
                {showForm === "login" && (
                    <LoginForm setShowForm={handleFormChange} />
                )}
                {showForm === "create" && (
                    <CreateAccountForm setShowForm={handleFormChange} />
                )}
            </div>
        </SigninLayout>
    );
};

export default Page;
