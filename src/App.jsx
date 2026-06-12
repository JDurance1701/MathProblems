import React, { useState, useEffect, useRef, useMemo } from "react";

// ---------------------------------------------------------------
// PROBLEM BANK — Applied Mathematical Methods (GT masters prep)
// Difficulty: 1 Warm-up, 2 Core, 3 Advanced, 4 Graduate, 5 Qualifier
// ---------------------------------------------------------------
const TOPICS = {
  calc: "Calculus & Vector Calculus",
  la: "Linear Algebra",
  ode: "Ordinary Differential Equations",
  cx: "Complex Analysis",
  ft: "Fourier & Transforms",
  pde: "Partial Differential Equations",
};

const BANK = [
// ================= CALCULUS & VECTOR CALCULUS =================
{ id:"C1", topic:"calc", diff:1, title:"A classic limit",
  statement: String.raw`Evaluate \( \lim_{x\to 0}\frac{1-\cos x}{x^2} \).`,
  hint: String.raw`Either apply L'Hôpital's rule twice, or expand \( \cos x \) in its Maclaurin series and keep terms through \( x^2 \).`,
  solution: String.raw`Using \( \cos x = 1 - \frac{x^2}{2} + \frac{x^4}{24} - \cdots \), the numerator is \( \frac{x^2}{2} - \frac{x^4}{24} + \cdots \). Dividing by \( x^2 \):
  \[ \frac{1-\cos x}{x^2} = \frac{1}{2} - \frac{x^2}{24} + \cdots \longrightarrow \boxed{\tfrac{1}{2}}. \]
  Series expansions are usually faster and more informative than repeated L'Hôpital — a habit worth building for asymptotics later in the course.` },

{ id:"C2", topic:"calc", diff:1, title:"Integration by parts",
  statement: String.raw`Compute \( \int x e^{x}\,dx \).`,
  hint: String.raw`Integration by parts with \( u = x \), \( dv = e^x dx \). The polynomial should be the part you differentiate.`,
  solution: String.raw`With \( u = x,\; dv = e^x dx \) we get \( du = dx,\; v = e^x \):
  \[ \int x e^x dx = x e^x - \int e^x dx = (x-1)e^x + C. \]` },

{ id:"C3", topic:"calc", diff:1, title:"Logarithmic differentiation",
  statement: String.raw`Differentiate \( f(x) = x^{x} \) for \( x > 0 \).`,
  hint: String.raw`Write \( y = x^x \), take \( \ln \) of both sides, then differentiate implicitly.`,
  solution: String.raw`Let \( y = x^x \), so \( \ln y = x\ln x \). Differentiating: \( \frac{y'}{y} = \ln x + 1 \), hence
  \[ f'(x) = x^{x}\left(\ln x + 1\right). \]
  Equivalently, \( x^x = e^{x\ln x} \) and the chain rule gives the same result.` },

{ id:"C4", topic:"calc", diff:2, title:"Substitution on an infinite interval",
  statement: String.raw`Evaluate \( \int_0^{\infty} x\,e^{-x^2}\,dx \).`,
  hint: String.raw`Substitute \( u = x^2 \). The factor of \( x \) is exactly what you need for \( du \).`,
  solution: String.raw`With \( u = x^2 \), \( du = 2x\,dx \):
  \[ \int_0^\infty x e^{-x^2} dx = \frac{1}{2}\int_0^\infty e^{-u}\,du = \frac{1}{2}. \]
  Compare with \( \int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2} \), which has no such lucky factor and requires the polar-coordinates trick (see the Gaussian integral problem).` },

{ id:"C5", topic:"calc", diff:2, title:"Maclaurin series and radius of convergence",
  statement: String.raw`Find the Maclaurin series of \( \ln(1+x) \) and determine its radius of convergence.`,
  hint: String.raw`Start from the geometric series for \( \frac{1}{1+x} \) and integrate term by term.`,
  solution: String.raw`Since \( \frac{1}{1+x} = \sum_{n=0}^{\infty} (-1)^n x^n \) for \( |x| \lt 1 \), integrating from \( 0 \) to \( x \):
  \[ \ln(1+x) = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n} x^{n} = x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots \]
  The radius of convergence is \( R = 1 \) (ratio test). The series also converges at \( x = 1 \) (alternating series), giving \( \ln 2 = 1 - \tfrac12 + \tfrac13 - \cdots \).` },

{ id:"C6", topic:"calc", diff:2, title:"Critical points in two variables",
  statement: String.raw`Find and classify all critical points of \( f(x,y) = x^3 + y^3 - 3xy \).`,
  hint: String.raw`Set \( f_x = f_y = 0 \) and solve the resulting symmetric system, then use the Hessian determinant \( D = f_{xx}f_{yy} - f_{xy}^2 \).`,
  solution: String.raw`\( f_x = 3x^2 - 3y = 0 \) and \( f_y = 3y^2 - 3x = 0 \) give \( y = x^2 \) and \( x = y^2 \), so \( x = x^4 \), i.e. \( x = 0 \) or \( x = 1 \). Critical points: \( (0,0) \) and \( (1,1) \).
  The Hessian is \( \begin{pmatrix} 6x & -3 \\ -3 & 6y \end{pmatrix} \).
  At \( (0,0) \): \( D = -9 \lt 0 \) — saddle point. At \( (1,1) \): \( D = 36 - 9 = 27 > 0 \) with \( f_{xx} = 6 > 0 \) — local minimum, \( f(1,1) = -1 \).` },

{ id:"C7", topic:"calc", diff:2, title:"Directional derivative",
  statement: String.raw`Let \( f(x,y,z) = x^2 y + z \). Find the directional derivative of \( f \) at \( (1,2,0) \) in the direction of \( \mathbf{v} = (1,1,1) \), and the direction of steepest ascent there.`,
  hint: String.raw`Compute \( \nabla f \), normalize \( \mathbf{v} \), and take the dot product. Steepest ascent is the direction of the gradient itself.`,
  solution: String.raw`\( \nabla f = (2xy,\; x^2,\; 1) \), so \( \nabla f(1,2,0) = (4,1,1) \). The unit vector is \( \hat{\mathbf{v}} = \frac{1}{\sqrt 3}(1,1,1) \), so
  \[ D_{\hat{\mathbf{v}}} f = \frac{4+1+1}{\sqrt 3} = \frac{6}{\sqrt 3} = 2\sqrt 3. \]
  Steepest ascent is along \( (4,1,1) \), with maximal rate \( \lVert \nabla f \rVert = \sqrt{18} = 3\sqrt 2 \).` },

{ id:"C8", topic:"calc", diff:3, title:"Lagrange multipliers",
  statement: String.raw`Find the extreme values of \( f(x,y) = xy \) subject to the constraint \( x^2 + y^2 = 2 \).`,
  hint: String.raw`Solve \( \nabla f = \lambda \nabla g \) together with the constraint. Symmetry suggests \( y = \pm x \).`,
  solution: String.raw`The system is \( y = 2\lambda x \), \( x = 2\lambda y \), \( x^2 + y^2 = 2 \). Multiplying the first two: \( xy = 4\lambda^2 xy \). If \( xy \neq 0 \), \( \lambda = \pm\frac12 \), giving \( y = \pm x \). With the constraint, \( x = \pm 1 \).
  Maximum: \( f = 1 \) at \( (1,1) \) and \( (-1,-1) \). Minimum: \( f = -1 \) at \( (1,-1) \) and \( (-1,1) \). (Points with \( xy = 0 \) give \( f = 0 \), neither extreme.)` },

{ id:"C9", topic:"calc", diff:3, title:"The Gaussian integral",
  statement: String.raw`Prove that \( \int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi} \).`,
  hint: String.raw`Square the integral, interpret it as a double integral over the plane, and switch to polar coordinates.`,
  solution: String.raw`Let \( I = \int_{-\infty}^\infty e^{-x^2} dx \). Then
  \[ I^2 = \int_{-\infty}^\infty \int_{-\infty}^\infty e^{-(x^2+y^2)}\,dx\,dy = \int_0^{2\pi}\!\!\int_0^\infty e^{-r^2} r\,dr\,d\theta = 2\pi \cdot \frac12 = \pi, \]
  using \( u = r^2 \) in the radial integral. Hence \( I = \sqrt{\pi} \). This integral is everywhere in applied math: Gaussian quadrature, the heat kernel, probability, and asymptotics.` },

{ id:"C10", topic:"calc", diff:3, title:"Differentiation under the integral sign",
  statement: String.raw`Define \( F(t) = \int_0^{\infty} e^{-tx}\,\frac{\sin x}{x}\,dx \) for \( t \ge 0 \). Compute \( F'(t) \), solve for \( F \), and deduce the Dirichlet integral \( \int_0^\infty \frac{\sin x}{x}dx \).`,
  hint: String.raw`Differentiating under the integral kills the awkward \( \frac1x \). You will need \( \int_0^\infty e^{-tx}\sin x\,dx = \frac{1}{1+t^2} \) and the boundary value \( F(t) \to 0 \) as \( t \to \infty \).`,
  solution: String.raw`Differentiating under the integral sign:
  \[ F'(t) = -\int_0^\infty e^{-tx}\sin x\,dx = -\frac{1}{1+t^2}. \]
  Integrating, \( F(t) = C - \arctan t \). Since \( |F(t)| \le \int_0^\infty e^{-tx}dx = \frac1t \to 0 \) as \( t \to \infty \), we need \( C = \frac{\pi}{2} \). Therefore
  \[ F(t) = \frac{\pi}{2} - \arctan t, \qquad \int_0^\infty \frac{\sin x}{x}\,dx = F(0) = \frac{\pi}{2}. \]
  This "Feynman trick" is a workhorse for integrals with no elementary antiderivative.` },

{ id:"C11", topic:"calc", diff:3, title:"Gamma function at one half",
  statement: String.raw`The Gamma function is \( \Gamma(s) = \int_0^\infty t^{s-1} e^{-t}\,dt \). Show that \( \Gamma\!\left(\tfrac12\right) = \sqrt{\pi} \), and state the recursion connecting \( \Gamma(s+1) \) to \( \Gamma(s) \).`,
  hint: String.raw`Substitute \( t = x^2 \) to turn the integral into a Gaussian. The recursion comes from integration by parts.`,
  solution: String.raw`With \( t = x^2 \), \( dt = 2x\,dx \):
  \[ \Gamma\!\left(\tfrac12\right) = \int_0^\infty t^{-1/2} e^{-t} dt = \int_0^\infty \frac{e^{-x^2}}{x}\,2x\,dx = 2\int_0^\infty e^{-x^2} dx = \sqrt{\pi}. \]
  Integration by parts gives \( \Gamma(s+1) = s\,\Gamma(s) \), so \( \Gamma(n+1) = n! \) — the Gamma function interpolates the factorial.` },

{ id:"C12", topic:"calc", diff:3, title:"Green's theorem and area",
  statement: String.raw`Use Green's theorem to show that the area enclosed by a simple closed curve \( C \) is \( A = \frac12 \oint_C (x\,dy - y\,dx) \), and apply it to the ellipse \( x = a\cos t,\; y = b\sin t \).`,
  hint: String.raw`In Green's theorem \( \oint P\,dx + Q\,dy = \iint (Q_x - P_y)\,dA \), choose \( P, Q \) so that \( Q_x - P_y = 1 \).`,
  solution: String.raw`Take \( P = -\tfrac{y}{2},\, Q = \tfrac{x}{2} \); then \( Q_x - P_y = 1 \) and Green's theorem yields \( \frac12\oint(x\,dy - y\,dx) = \iint_D 1\,dA = A \).
  For the ellipse: \( x\,dy - y\,dx = (a\cos t)(b\cos t)\,dt - (b\sin t)(-a\sin t)\,dt = ab\,dt \), so
  \[ A = \frac12 \int_0^{2\pi} ab\,dt = \pi a b. \]` },

{ id:"C13", topic:"calc", diff:3, title:"Divergence theorem",
  statement: String.raw`Compute the outward flux of \( \mathbf{F} = (x, y, z) \) through the unit sphere \( x^2+y^2+z^2 = 1 \), both directly and via the divergence theorem.`,
  hint: String.raw`On the sphere, the outward unit normal is \( \mathbf{n} = (x,y,z) \) itself. And \( \nabla \cdot \mathbf{F} \) is constant.`,
  solution: String.raw`Directly: on the sphere \( \mathbf{F}\cdot\mathbf{n} = x^2+y^2+z^2 = 1 \), so the flux is the surface area, \( 4\pi \).
  Via the divergence theorem: \( \nabla\cdot\mathbf{F} = 3 \), so
  \[ \iint_S \mathbf{F}\cdot\mathbf{n}\,dS = \iiint_B 3\,dV = 3\cdot\frac{4\pi}{3} = 4\pi. \quad \checkmark \]` },

{ id:"C14", topic:"calc", diff:4, title:"Verifying Stokes' theorem",
  statement: String.raw`Verify Stokes' theorem for \( \mathbf{F} = (-y,\; x,\; z^2) \) on the upper unit hemisphere \( S \) (oriented upward) with boundary the unit circle in the \( xy \)-plane.`,
  hint: String.raw`Compute \( \nabla\times\mathbf{F} \) first — it is constant — then use the fact that the flux of a constant vertical field through \( S \) equals its flux through the disk \( S \) projects onto.`,
  solution: String.raw`Curl: \( \nabla\times\mathbf{F} = \left( \partial_y z^2 - \partial_z x,\; \partial_z(-y) - \partial_x z^2,\; \partial_x x - \partial_y(-y) \right) = (0,0,2) \).
  Surface side: since \( S \) and the unit disk \( D \) share the boundary circle and \( \nabla\times\mathbf{F} \) is divergence-free (it is constant), the flux through \( S \) equals the flux through \( D \): \( \iint_D 2\,dA = 2\pi \).
  Line side: on \( x = \cos t,\, y = \sin t \),
  \[ \oint \mathbf{F}\cdot d\mathbf{r} = \oint (-y\,dx + x\,dy) = \int_0^{2\pi} (\sin^2 t + \cos^2 t)\,dt = 2\pi. \quad \checkmark \]` },

{ id:"C15", topic:"calc", diff:5, title:"Laplace's method and Stirling's formula",
  statement: String.raw`Starting from \( n! = \Gamma(n+1) = \int_0^\infty t^{n} e^{-t}\,dt \), use Laplace's method to derive Stirling's approximation
  \[ n! \sim \sqrt{2\pi n}\,\left(\frac{n}{e}\right)^{n}. \]`,
  hint: String.raw`Substitute \( t = ns \) to put the integral in the form \( \int e^{n\phi(s)}ds \) with \( \phi(s) = \ln s - s \). Expand \( \phi \) to second order about its maximum and evaluate the resulting Gaussian.`,
  solution: String.raw`With \( t = ns \):
  \[ n! = n^{n+1} \int_0^\infty e^{n(\ln s - s)}\,ds. \]
  The phase \( \phi(s) = \ln s - s \) has its maximum where \( \phi'(s) = \tfrac1s - 1 = 0 \), i.e. \( s = 1 \), with \( \phi(1) = -1 \) and \( \phi''(1) = -1 \). Laplace's method replaces \( \phi \) by its quadratic approximation \( -1 - \tfrac12 (s-1)^2 \):
  \[ \int_0^\infty e^{n\phi(s)} ds \sim e^{-n} \int_{-\infty}^\infty e^{-n u^2/2}\,du = e^{-n}\sqrt{\frac{2\pi}{n}}. \]
  Therefore \( n! \sim n^{n+1} e^{-n} \sqrt{2\pi/n} = \sqrt{2\pi n}\,(n/e)^n \). Laplace's method — localize at the maximum of the exponent, do the Gaussian — is the prototype for all of asymptotic analysis (steepest descent, stationary phase, WKB).` },

// ================= LINEAR ALGEBRA =================
{ id:"L1", topic:"la", diff:1, title:"A small linear system",
  statement: String.raw`Solve by elimination: \( \;x + 2y = 5,\quad 3x - y = 1. \)`,
  hint: String.raw`Eliminate one variable: multiply the second equation by 2 and add.`,
  solution: String.raw`Multiplying the second equation by 2: \( 6x - 2y = 2 \). Adding to the first: \( 7x = 7 \), so \( x = 1 \), then \( y = 2 \). Check: \( 1 + 4 = 5 \) and \( 3 - 2 = 1 \). \( \checkmark \)` },

{ id:"L2", topic:"la", diff:1, title:"Determinant and inverse",
  statement: String.raw`Let \( A = \begin{pmatrix} 2 & 1 \\ 5 & 3 \end{pmatrix} \). Compute \( \det A \) and \( A^{-1} \).`,
  hint: String.raw`For a \( 2\times2 \) matrix, swap the diagonal, negate the off-diagonal, divide by the determinant.`,
  solution: String.raw`\( \det A = 6 - 5 = 1 \), so
  \[ A^{-1} = \frac{1}{1}\begin{pmatrix} 3 & -1 \\ -5 & 2 \end{pmatrix} = \begin{pmatrix} 3 & -1 \\ -5 & 2 \end{pmatrix}. \]` },

{ id:"L3", topic:"la", diff:2, title:"Eigenvalues of a symmetric matrix",
  statement: String.raw`Find the eigenvalues and eigenvectors of \( A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix} \).`,
  hint: String.raw`Solve \( \det(A - \lambda I) = 0 \). For a symmetric matrix, expect orthogonal eigenvectors.`,
  solution: String.raw`\( \det(A-\lambda I) = (2-\lambda)^2 - 1 = 0 \) gives \( \lambda = 1, 3 \).
  For \( \lambda = 1 \): \( (A - I)v = 0 \) gives \( v_1 = (1,-1)^{T} \). For \( \lambda = 3 \): \( v_2 = (1,1)^{T} \).
  Note \( v_1 \perp v_2 \) — symmetric matrices always have orthogonal eigenvectors for distinct eigenvalues (spectral theorem).` },

{ id:"L4", topic:"la", diff:2, title:"Rank, nullity, and the null space",
  statement: String.raw`For \( A = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 1 & 1 \end{pmatrix} \), find the rank, the nullity, and a basis for the null space.`,
  hint: String.raw`Row 2 is a multiple of row 1. Use rank + nullity = number of columns.`,
  solution: String.raw`Row reduction: \( R_2 \to R_2 - 2R_1 \) gives a zero row; rows 1 and 3 are independent, so \( \operatorname{rank} A = 2 \) and the nullity is \( 3 - 2 = 1 \).
  Solving \( x + 2y + 3z = 0 \) and \( x + y + z = 0 \): subtracting gives \( y = -2z \), then \( x = z \). Basis vector:
  \[ \mathbf{n} = (1, -2, 1)^{T}. \]` },

{ id:"L5", topic:"la", diff:2, title:"Orthogonal projection",
  statement: String.raw`Find the orthogonal projection of \( \mathbf{b} = (1,2,2)^{T} \) onto the line spanned by \( \mathbf{a} = (1,1,0)^{T} \), and the component of \( \mathbf{b} \) orthogonal to \( \mathbf{a} \).`,
  hint: String.raw`\( \operatorname{proj}_{\mathbf a}\mathbf b = \dfrac{\mathbf a^{T}\mathbf b}{\mathbf a^{T}\mathbf a}\,\mathbf a \).`,
  solution: String.raw`\( \mathbf a^T \mathbf b = 3 \), \( \mathbf a^T \mathbf a = 2 \), so
  \[ \operatorname{proj}_{\mathbf a}\mathbf b = \tfrac32 (1,1,0)^T = \left(\tfrac32, \tfrac32, 0\right)^T, \qquad \mathbf b - \operatorname{proj}_{\mathbf a}\mathbf b = \left(-\tfrac12, \tfrac12, 2\right)^T. \]
  Check orthogonality: \( (-\tfrac12)(1) + (\tfrac12)(1) + 0 = 0 \). \( \checkmark \) Projection is the foundation of least squares and Fourier coefficients alike.` },

{ id:"L6", topic:"la", diff:3, title:"Gram–Schmidt",
  statement: String.raw`Apply Gram–Schmidt to \( \mathbf{v}_1 = (1,1,0),\; \mathbf{v}_2 = (1,0,1),\; \mathbf{v}_3 = (0,1,1) \) to produce an orthonormal basis of \( \mathbb{R}^3 \).`,
  hint: String.raw`Subtract from each new vector its projections onto the previously built orthonormal vectors, then normalize.`,
  solution: String.raw`\( \mathbf{q}_1 = \frac{1}{\sqrt2}(1,1,0) \).
  \( \mathbf{u}_2 = \mathbf{v}_2 - (\mathbf{v}_2\cdot\mathbf{q}_1)\mathbf{q}_1 = (1,0,1) - \tfrac12(1,1,0) = \left(\tfrac12,-\tfrac12,1\right) \), so \( \mathbf{q}_2 = \frac{1}{\sqrt6}(1,-1,2) \).
  \( \mathbf{u}_3 = \mathbf{v}_3 - (\mathbf{v}_3\cdot\mathbf{q}_1)\mathbf{q}_1 - (\mathbf{v}_3\cdot\mathbf{q}_2)\mathbf{q}_2 = (0,1,1) - \tfrac12(1,1,0) - \tfrac16(1,-1,2) = \left(-\tfrac23,\tfrac23,\tfrac23\right) \), so \( \mathbf{q}_3 = \frac{1}{\sqrt3}(-1,1,1) \).
  Quick check: \( \mathbf{q}_3 \cdot \mathbf{q}_1 = 0 \), \( \mathbf{q}_3\cdot\mathbf{q}_2 = \frac{-1-1+2}{\sqrt{18}} = 0 \). \( \checkmark \)` },

{ id:"L7", topic:"la", diff:3, title:"Least squares line",
  statement: String.raw`Find the least-squares line \( y = a + bx \) through the data points \( (0,1), (1,2), (2,2) \) by solving the normal equations \( A^{T}A\,\mathbf{c} = A^{T}\mathbf{y} \).`,
  hint: String.raw`Here \( A \) has rows \( (1, x_i) \). Build the \( 2\times2 \) system from \( \sum 1, \sum x_i, \sum x_i^2 \) and \( \sum y_i, \sum x_i y_i \).`,
  solution: String.raw`The normal equations are
  \[ \begin{pmatrix} 3 & 3 \\ 3 & 5 \end{pmatrix} \begin{pmatrix} a \\ b \end{pmatrix} = \begin{pmatrix} 5 \\ 6 \end{pmatrix}, \]
  with determinant \( 6 \). Cramer's rule: \( a = \frac{25 - 18}{6} = \frac{7}{6} \), \( b = \frac{18 - 15}{6} = \frac{1}{2} \). So \( y = \frac{7}{6} + \frac{x}{2} \). The residuals \( \left(-\tfrac16, \tfrac13, -\tfrac16\right) \) sum to zero, as they must — the residual is orthogonal to the column of ones.` },

{ id:"L8", topic:"la", diff:3, title:"Cayley–Hamilton in action",
  statement: String.raw`Let \( A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \). Use the Cayley–Hamilton theorem to express \( A^{-1} \) as a polynomial in \( A \), and compute it.`,
  hint: String.raw`The characteristic polynomial is \( \lambda^2 - (\operatorname{tr}A)\lambda + \det A \). Substitute \( A \), then multiply through by \( A^{-1} \).`,
  solution: String.raw`\( \operatorname{tr} A = 5 \), \( \det A = -2 \), so \( A^2 - 5A - 2I = 0 \). Multiplying by \( A^{-1} \):
  \[ A - 5I - 2A^{-1} = 0 \implies A^{-1} = \tfrac12(A - 5I) = \tfrac12\begin{pmatrix} -4 & 2 \\ 3 & -1 \end{pmatrix} = \begin{pmatrix} -2 & 1 \\ \tfrac32 & -\tfrac12 \end{pmatrix}. \]
  Cayley–Hamilton is also the standard route to closed forms for \( A^n \) and \( e^{At} \) in low dimensions.` },

{ id:"L9", topic:"la", diff:4, title:"Matrix exponential as rotation",
  statement: String.raw`Compute \( e^{At} \) for \( A = \begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix} \) and interpret the result geometrically.`,
  hint: String.raw`Compute the powers of \( A \): they cycle with period 4. Group the series into even and odd terms.`,
  solution: String.raw`\( A^2 = -I \), so \( A^3 = -A,\; A^4 = I \), and the exponential series splits:
  \[ e^{At} = I\left(1 - \tfrac{t^2}{2!} + \cdots\right) + A\left(t - \tfrac{t^3}{3!} + \cdots\right) = I\cos t + A \sin t = \begin{pmatrix} \cos t & \sin t \\ -\sin t & \cos t \end{pmatrix}. \]
  This is rotation by angle \( t \) (clockwise): \( A \) behaves exactly like the imaginary unit \( i \), and \( e^{At} \) like \( e^{it} \). Skew-symmetric generators always exponentiate to orthogonal matrices.` },

{ id:"L10", topic:"la", diff:4, title:"Exponential of a Jordan block",
  statement: String.raw`Compute \( e^{Jt} \) for the Jordan block \( J = \begin{pmatrix} \lambda & 1 \\ 0 & \lambda \end{pmatrix} \). Why does a \( t e^{\lambda t} \) term appear in ODE systems with repeated eigenvalues?`,
  hint: String.raw`Write \( J = \lambda I + N \) where \( N \) is nilpotent (\( N^2 = 0 \)), and use that \( \lambda I \) commutes with \( N \).`,
  solution: String.raw`Since \( \lambda I \) and \( N = \begin{pmatrix} 0 & 1 \\ 0 & 0\end{pmatrix} \) commute and \( N^2 = 0 \):
  \[ e^{Jt} = e^{\lambda t} e^{Nt} = e^{\lambda t}(I + Nt) = e^{\lambda t}\begin{pmatrix} 1 & t \\ 0 & 1 \end{pmatrix}. \]
  The off-diagonal entry \( t\,e^{\lambda t} \) is exactly the secular term that shows up in \( \mathbf{x}' = A\mathbf{x} \) when \( A \) has a defective (repeated, geometrically deficient) eigenvalue.` },

{ id:"L11", topic:"la", diff:4, title:"Positive definiteness",
  statement: String.raw`Show that \( A = \begin{pmatrix} 2 & -1 & 0 \\ -1 & 2 & -1 \\ 0 & -1 & 2 \end{pmatrix} \) is positive definite, using leading principal minors, and find its eigenvalues. (This matrix is the discrete second derivative — it returns in the PDE section.)`,
  hint: String.raw`Sylvester's criterion: all leading principal minors positive. For eigenvalues, try the ansatz \( v_k = \sin\frac{k j \pi}{4} \), or just expand the characteristic polynomial.`,
  solution: String.raw`Minors: \( 2 > 0 \); \( \det\begin{pmatrix}2&-1\\-1&2\end{pmatrix} = 3 > 0 \); \( \det A = 2(3) - (-1)(-2) = 4 > 0 \). Positive definite by Sylvester's criterion.
  Characteristic polynomial: \( (2-\lambda)\left[(2-\lambda)^2 - 1\right] - (2-\lambda) = (2-\lambda)\left[(2-\lambda)^2 - 2\right] \), giving
  \[ \lambda = 2,\; 2 \pm \sqrt2 \quad (\text{all positive, confirming definiteness}). \]
  These are the eigenvalues \( 2 - 2\cos\frac{j\pi}{4} \) of the discrete Laplacian — the matrix analogue of \( -u'' \) with Dirichlet conditions.` },

{ id:"L12", topic:"la", diff:5, title:"A small SVD by hand",
  statement: String.raw`Find the singular values of \( A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} \), and explain how the SVD \( A = U\Sigma V^{T} \) describes the action of \( A \) on the unit circle.`,
  hint: String.raw`The singular values are the square roots of the eigenvalues of \( A^{T}A \). You should recognize the answer — it involves the golden ratio.`,
  solution: String.raw`\( A^T A = \begin{pmatrix} 1 & 1 \\ 1 & 2 \end{pmatrix} \) has characteristic polynomial \( \mu^2 - 3\mu + 1 = 0 \), so \( \mu = \frac{3 \pm \sqrt5}{2} \). The singular values are
  \[ \sigma_1 = \sqrt{\tfrac{3+\sqrt5}{2}} = \frac{1+\sqrt5}{2} = \varphi, \qquad \sigma_2 = \frac{1}{\varphi}, \]
  (note \( \sigma_1\sigma_2 = |\det A| = 1 \) and \( \sigma_1^2 + \sigma_2^2 = \lVert A\rVert_F^2 = 3 \), confirming the algebra).
  Geometrically: \( A \) maps the unit circle to an ellipse. \( V \) rotates the principal input directions to the axes, \( \Sigma \) stretches by \( \varphi \) and compresses by \( 1/\varphi \), and \( U \) rotates the result into place — every matrix is rotation–stretch–rotation.` },

{ id:"L13", topic:"la", diff:5, title:"Rayleigh quotient",
  statement: String.raw`Let \( A \) be a real symmetric \( n\times n \) matrix with eigenvalues \( \lambda_1 \le \cdots \le \lambda_n \). Prove that
  \[ \lambda_n = \max_{\mathbf{x}\neq 0} \frac{\mathbf{x}^{T}A\mathbf{x}}{\mathbf{x}^{T}\mathbf{x}}, \]
  and identify where the maximum is attained.`,
  hint: String.raw`Expand \( \mathbf{x} \) in an orthonormal eigenbasis and write the Rayleigh quotient as a weighted average of the eigenvalues.`,
  solution: String.raw`By the spectral theorem, \( A \) has an orthonormal eigenbasis \( \mathbf{q}_1,\dots,\mathbf{q}_n \). Writing \( \mathbf{x} = \sum c_i \mathbf{q}_i \):
  \[ R(\mathbf{x}) = \frac{\mathbf{x}^T A \mathbf{x}}{\mathbf{x}^T\mathbf{x}} = \frac{\sum_i \lambda_i c_i^2}{\sum_i c_i^2}, \]
  a convex combination of the \( \lambda_i \). Hence \( \lambda_1 \le R(\mathbf{x}) \le \lambda_n \), with \( R = \lambda_n \) when \( \mathbf{x} = \mathbf{q}_n \) (any nonzero vector in the top eigenspace). The same argument gives \( \lambda_1 \) as the minimum; the intermediate eigenvalues come from the Courant–Fischer min–max theorem. This variational viewpoint carries over directly to Sturm–Liouville problems and PDE eigenvalues.` },

{ id:"L14", topic:"la", diff:5, title:"Fredholm alternative (finite dimensions)",
  statement: String.raw`State the Fredholm alternative for \( A\mathbf{x} = \mathbf{b} \) with a square matrix \( A \). Then let \( A = \begin{pmatrix} 1 & 1 \\ 2 & 2 \end{pmatrix} \): determine for which \( \mathbf{b} = (b_1, b_2)^{T} \) the system is solvable, and verify the criterion for \( \mathbf{b} = (1,2)^{T} \) and \( \mathbf{b} = (1,1)^{T} \).`,
  hint: String.raw`Solvability requires \( \mathbf{b} \perp \operatorname{null}(A^{T}) \). Find the null space of \( A^{T} \) first.`,
  solution: String.raw`Fredholm alternative: either \( A\mathbf{x} = \mathbf{b} \) has a solution for every \( \mathbf{b} \) (when \( A \) is invertible), or \( A^{T}\mathbf{y} = 0 \) has nontrivial solutions and \( A\mathbf{x} = \mathbf{b} \) is solvable precisely when \( \mathbf{y}^{T}\mathbf{b} = 0 \) for all such \( \mathbf{y} \).
  Here \( A^T = \begin{pmatrix} 1 & 2 \\ 1 & 2 \end{pmatrix} \) has null space spanned by \( \mathbf{y} = (2,-1)^T \). Solvability condition: \( 2b_1 - b_2 = 0 \).
  For \( \mathbf{b} = (1,2)^T \): \( 2 - 2 = 0 \) — solvable (e.g. \( \mathbf{x} = (1,0)^T \)). For \( \mathbf{b} = (1,1)^T \): \( 2 - 1 = 1 \neq 0 \) — no solution. The infinite-dimensional version governs solvability of boundary value problems at resonance.` },

// ================= ORDINARY DIFFERENTIAL EQUATIONS =================
{ id:"O1", topic:"ode", diff:1, title:"Exponential growth and decay",
  statement: String.raw`Solve \( y' = ky \) with \( y(0) = y_0 \). If a radioactive sample loses half its mass in 10 days, what is \( k \)?`,
  hint: String.raw`Separate variables. For the half-life, impose \( y(10) = \tfrac12 y_0 \).`,
  solution: String.raw`Separating: \( \frac{dy}{y} = k\,dt \), so \( y = y_0 e^{kt} \). The half-life condition gives \( e^{10k} = \tfrac12 \), hence
  \[ k = -\frac{\ln 2}{10} \approx -0.0693 \text{ per day}. \]` },

{ id:"O2", topic:"ode", diff:2, title:"Integrating factor",
  statement: String.raw`Solve the initial value problem \( y' + 2y = e^{-t},\; y(0) = 1 \).`,
  hint: String.raw`Multiply by the integrating factor \( \mu(t) = e^{\int 2\,dt} = e^{2t} \) so the left side becomes a perfect derivative.`,
  solution: String.raw`Multiplying by \( e^{2t} \): \( \left(e^{2t}y\right)' = e^{t} \), so \( e^{2t}y = e^t + C \), giving \( y = e^{-t} + Ce^{-2t} \). With \( y(0) = 1 \): \( 1 = 1 + C \), so \( C = 0 \) and
  \[ y(t) = e^{-t}. \]` },

{ id:"O3", topic:"ode", diff:2, title:"Exact equations",
  statement: String.raw`Show that \( (2xy + 1)\,dx + (x^2 + 3y^2)\,dy = 0 \) is exact, and solve it.`,
  hint: String.raw`Check \( \partial M/\partial y = \partial N/\partial x \), then find \( F \) with \( F_x = M \), \( F_y = N \).`,
  solution: String.raw`\( M_y = 2x = N_x \), so the equation is exact. Integrating \( F_x = 2xy + 1 \) in \( x \): \( F = x^2 y + x + g(y) \). Then \( F_y = x^2 + g'(y) = x^2 + 3y^2 \) gives \( g = y^3 \). The solution is the level set
  \[ x^2 y + x + y^3 = C. \]` },

{ id:"O4", topic:"ode", diff:2, title:"Constant coefficients",
  statement: String.raw`Find the general solution of \( y'' - 3y' + 2y = 0 \), and the particular solution with \( y(0) = 0,\; y'(0) = 1 \).`,
  hint: String.raw`Try \( y = e^{rt} \) and factor the characteristic polynomial.`,
  solution: String.raw`The characteristic equation \( r^2 - 3r + 2 = (r-1)(r-2) = 0 \) gives \( y = C_1 e^{t} + C_2 e^{2t} \). The initial conditions give \( C_1 + C_2 = 0 \), \( C_1 + 2C_2 = 1 \), so \( C_2 = 1, C_1 = -1 \):
  \[ y(t) = e^{2t} - e^{t}. \]` },

{ id:"O5", topic:"ode", diff:3, title:"Resonance",
  statement: String.raw`Solve \( y'' + y = \cos t \). Why does the solution grow without bound, and what physical phenomenon does this model?`,
  hint: String.raw`The forcing frequency matches a natural frequency, so the usual guess \( A\cos t + B\sin t \) fails. Multiply the ansatz by \( t \).`,
  solution: String.raw`The homogeneous solution is \( C_1\cos t + C_2 \sin t \). Since \( \cos t \) solves the homogeneous equation, try \( y_p = t(A\cos t + B\sin t) \). Substituting: \( y_p'' + y_p = -2A\sin t + 2B\cos t \), so \( A = 0,\; B = \tfrac12 \):
  \[ y = C_1 \cos t + C_2 \sin t + \frac{t}{2}\sin t. \]
  The amplitude grows linearly in \( t \): this is resonance — forcing an oscillator at its natural frequency. It is why soldiers break step on bridges and why the \( t e^{\lambda t} \) terms from repeated roots are called secular terms.` },

{ id:"O6", topic:"ode", diff:3, title:"Variation of parameters",
  statement: String.raw`Solve \( y'' + y = \sec t \) on \( \left(-\tfrac\pi2, \tfrac\pi2\right) \) using variation of parameters.`,
  hint: String.raw`With \( y_1 = \cos t, y_2 = \sin t \) (Wronskian \( W = 1 \)), use \( y_p = -y_1 \int \frac{y_2 f}{W} + y_2 \int \frac{y_1 f}{W} \).`,
  solution: String.raw`Here \( f(t) = \sec t \) and \( W = \cos^2 t + \sin^2 t = 1 \):
  \[ y_p = -\cos t \int \sin t \sec t\,dt + \sin t \int \cos t \sec t\,dt = \cos t \,\ln|\cos t| + t\sin t. \]
  General solution: \( y = C_1\cos t + C_2 \sin t + \cos t\,\ln(\cos t) + t\sin t \). Variation of parameters works for any forcing — it is undetermined coefficients without the guesswork, and it is the formula that becomes the Green's function method.` },

{ id:"O7", topic:"ode", diff:3, title:"Euler (equidimensional) equation",
  statement: String.raw`Solve \( x^2 y'' + x y' - y = 0 \) for \( x > 0 \).`,
  hint: String.raw`Try \( y = x^{r} \); each derivative trades a power of \( x \) for a factor of \( r \).`,
  solution: String.raw`Substituting \( y = x^r \): \( r(r-1) + r - 1 = r^2 - 1 = 0 \), so \( r = \pm 1 \):
  \[ y = C_1 x + \frac{C_2}{x}. \]
  Euler equations are the radial part of Laplace's equation in polar coordinates — the \( r^{n} \) and \( r^{-n} \) modes you will meet again on the disk.` },

{ id:"O8", topic:"ode", diff:3, title:"Linear systems via eigenvalues",
  statement: String.raw`Solve \( \mathbf{x}' = A\mathbf{x} \) with \( A = \begin{pmatrix} 1 & 1 \\ 4 & 1 \end{pmatrix} \), and describe the behavior of solutions as \( t \to \infty \).`,
  hint: String.raw`Find eigenvalues and eigenvectors; the general solution is a combination of \( e^{\lambda t}\mathbf{v} \) modes.`,
  solution: String.raw`\( \det(A - \lambda I) = (1-\lambda)^2 - 4 = 0 \) gives \( \lambda = 3, -1 \) with eigenvectors \( (1,2)^T \) and \( (1,-2)^T \):
  \[ \mathbf{x}(t) = C_1 e^{3t}\begin{pmatrix}1\\2\end{pmatrix} + C_2 e^{-t}\begin{pmatrix}1\\-2\end{pmatrix}. \]
  The origin is a saddle: generic solutions are swept out along the unstable direction \( (1,2)^T \); only initial data on the stable line \( (1,-2)^T \) decay to the origin.` },

{ id:"O9", topic:"ode", diff:3, title:"Phase plane classification",
  statement: String.raw`Classify the equilibrium at the origin for \( \mathbf{x}' = \begin{pmatrix} 0 & 1 \\ -2 & -3 \end{pmatrix}\mathbf{x} \) (type and stability), and sketch the qualitative phase portrait in words.`,
  hint: String.raw`Trace and determinant tell the whole story: \( \lambda^2 - (\operatorname{tr})\lambda + \det = 0 \).`,
  solution: String.raw`The characteristic equation is \( \lambda^2 + 3\lambda + 2 = (\lambda+1)(\lambda+2) = 0 \): two real negative eigenvalues \( -1, -2 \). The origin is a stable node. Trajectories approach the origin tangent to the slow eigenvector (for \( \lambda = -1 \), direction \( (1,-1)^T \)), since the fast mode \( e^{-2t} \) dies first. This system is the phase-plane form of the damped oscillator \( u'' + 3u' + 2u = 0 \) (overdamped).` },

{ id:"O10", topic:"ode", diff:4, title:"Series solution: the Airy equation",
  statement: String.raw`Find the first three nonzero terms of each of the two independent power-series solutions of the Airy equation \( y'' = xy \) about \( x = 0 \).`,
  hint: String.raw`Substitute \( y = \sum a_n x^n \) and match powers to get a recurrence relating \( a_{n+2} \) to \( a_{n-1} \) — coefficients advance in steps of 3.`,
  solution: String.raw`Substituting the series gives \( \sum (n+2)(n+1)a_{n+2}x^{n} = \sum a_{n-1}x^{n} \), so
  \[ a_{n+2} = \frac{a_{n-1}}{(n+2)(n+1)}, \qquad a_2 = 0. \]
  Taking \( (a_0, a_1) = (1,0) \) and then \( (0,1) \):
  \[ y_1 = 1 + \frac{x^3}{6} + \frac{x^6}{180} + \cdots, \qquad y_2 = x + \frac{x^4}{12} + \frac{x^7}{504} + \cdots \]
  Suitable combinations give the Airy functions \( \operatorname{Ai}, \operatorname{Bi} \), which govern turning points in WKB theory, optics, and quantum mechanics.` },

{ id:"O11", topic:"ode", diff:4, title:"A Sturm–Liouville eigenvalue problem",
  statement: String.raw`Find all eigenvalues and eigenfunctions of
  \[ y'' + \lambda y = 0, \qquad y(0) = 0,\quad y'(L) = 0. \]`,
  hint: String.raw`Check \( \lambda \le 0 \) first (only trivial solutions). For \( \lambda = \mu^2 > 0 \), apply the boundary conditions to \( y = A\sin\mu x + B\cos\mu x \).`,
  solution: String.raw`For \( \lambda \le 0 \) the boundary conditions force \( y \equiv 0 \). For \( \lambda = \mu^2 > 0 \): \( y(0) = 0 \) gives \( y = A\sin\mu x \), and \( y'(L) = A\mu\cos\mu L = 0 \) requires \( \mu L = \left(n - \tfrac12\right)\pi \). So
  \[ \lambda_n = \left( \frac{(2n-1)\pi}{2L} \right)^{2}, \qquad y_n = \sin\!\left( \frac{(2n-1)\pi x}{2L} \right), \quad n = 1, 2, \dots \]
  As S–L theory guarantees: a discrete increasing sequence of real eigenvalues, with eigenfunctions orthogonal on \( (0, L) \) — the basis you will expand in for the heat equation with one insulated end.` },

{ id:"O12", topic:"ode", diff:4, title:"Linearization of the damped pendulum",
  statement: String.raw`For the damped pendulum \( \theta'' + \gamma\theta' + \sin\theta = 0 \) (with \( \gamma > 0 \)), find the equilibria and classify each by linearization. Treat the case \( 0 \lt \gamma \lt 2 \) explicitly at the bottom equilibrium.`,
  hint: String.raw`Write as a system in \( (\theta, \omega) \). Equilibria are \( \theta = n\pi,\; \omega = 0 \). The Jacobian involves \( \cos\theta \), which flips sign between the bottom and the top.`,
  solution: String.raw`As a system: \( \theta' = \omega,\; \omega' = -\sin\theta - \gamma\omega \), with Jacobian \( J = \begin{pmatrix} 0 & 1 \\ -\cos\theta & -\gamma \end{pmatrix} \).
  At \( (0,0) \) (pendulum down): eigenvalues solve \( \lambda^2 + \gamma\lambda + 1 = 0 \), i.e. \( \lambda = \frac{-\gamma \pm \sqrt{\gamma^2 - 4}}{2} \). For \( 0 \lt \gamma \lt 2 \) these are complex with negative real part: a stable spiral (underdamped ringing).
  At \( (\pi, 0) \) (pendulum up): \( \lambda^2 + \gamma\lambda - 1 = 0 \) has roots of opposite sign: a saddle, unstable for every \( \gamma \). Linearization (Hartman–Grobman) is decisive at both points since no eigenvalue has zero real part.` },

{ id:"O13", topic:"ode", diff:5, title:"Boundary layer / matched asymptotics",
  statement: String.raw`For small \( \varepsilon > 0 \), find the leading-order uniform approximation to
  \[ \varepsilon y'' + y' + y = 0, \qquad y(0) = 0,\quad y(1) = 1. \]
  Where is the boundary layer, and how thick is it?`,
  hint: String.raw`The outer solution (set \( \varepsilon = 0 \)) is first order and can satisfy only one boundary condition — keep the one at \( x = 1 \). Rescale \( X = x/\varepsilon \) near \( x = 0 \) for the inner solution, then match.`,
  solution: String.raw`Outer: \( y' + y = 0 \) gives \( y_{\text{out}} = Ae^{-x} \); imposing \( y(1) = 1 \) yields \( A = e \), so \( y_{\text{out}} = e^{1-x} \). The neglected condition at \( x = 0 \) signals a layer there (the coefficient of \( y' \) is positive, so the layer sits at the left endpoint), of thickness \( O(\varepsilon) \).
  Inner: with \( X = x/\varepsilon \), to leading order \( Y'' + Y' = 0 \), so \( Y = B\left(1 - e^{-X}\right) \) after applying \( Y(0) = 0 \).
  Matching \( \lim_{X\to\infty} Y = \lim_{x\to 0} y_{\text{out}} \) gives \( B = e \). The composite expansion (outer + inner − common part) is
  \[ y(x) \approx e^{1-x} - e^{1 - x/\varepsilon}. \]
  The solution rises steeply from 0 across the \( O(\varepsilon) \) layer, then follows the smooth outer profile \( e^{1-x} \).` },

{ id:"O14", topic:"ode", diff:5, title:"WKB approximation",
  statement: String.raw`Derive the leading-order WKB approximation for
  \[ \varepsilon^2 y'' = Q(x)\,y, \qquad Q(x) > 0, \]
  by substituting \( y = e^{S(x)/\varepsilon} \) and expanding \( S = S_0 + \varepsilon S_1 + \cdots \).`,
  hint: String.raw`At order \( \varepsilon^0 \) you get the eikonal equation \( (S_0')^2 = Q \); at order \( \varepsilon^1 \), the transport equation determines the amplitude prefactor.`,
  solution: String.raw`Substituting, \( \varepsilon^2 y'' = \left[(S')^2 + \varepsilon S''\right] y + O(\varepsilon^2) \) with \( S = S_0 + \varepsilon S_1 \):
  Order 1: \( (S_0')^2 = Q \Rightarrow S_0 = \pm\int^x \sqrt{Q(s)}\,ds \) (eikonal).
  Order \( \varepsilon \): \( 2S_0' S_1' + S_0'' = 0 \Rightarrow S_1 = -\tfrac12 \ln S_0' = -\tfrac14 \ln Q \) (transport). Hence
  \[ y(x) \sim \frac{C_\pm}{Q(x)^{1/4}} \exp\left( \pm\frac{1}{\varepsilon}\int^x \sqrt{Q(s)}\,ds \right). \]
  For \( Q \lt 0 \) the exponentials become oscillations \( \exp\left(\pm\frac{i}{\varepsilon}\int\sqrt{-Q}\right) \); the approximation fails near turning points \( Q = 0 \), where Airy functions take over (see the Airy equation problem).` },

// ================= COMPLEX ANALYSIS =================
{ id:"X1", topic:"cx", diff:1, title:"Powers via polar form",
  statement: String.raw`Compute \( (1+i)^{10} \).`,
  hint: String.raw`Write \( 1 + i \) in polar form \( r e^{i\theta} \) and use De Moivre.`,
  solution: String.raw`\( 1+i = \sqrt2\, e^{i\pi/4} \), so
  \[ (1+i)^{10} = 2^{5} e^{i\,10\pi/4} = 32\, e^{i5\pi/2} = 32\,e^{i\pi/2} = 32i. \]` },

{ id:"X2", topic:"cx", diff:2, title:"Roots of a complex number",
  statement: String.raw`Find all cube roots of \( -8 \).`,
  hint: String.raw`Write \( -8 = 8e^{i(\pi + 2\pi k)} \) and take the cube root of modulus and argument.`,
  solution: String.raw`The roots are \( 2e^{i(\pi + 2\pi k)/3} \) for \( k = 0,1,2 \):
  \[ 2e^{i\pi/3} = 1 + i\sqrt3, \qquad 2e^{i\pi} = -2, \qquad 2e^{i5\pi/3} = 1 - i\sqrt3. \]
  They form an equilateral triangle on the circle \( |z| = 2 \).` },

{ id:"X3", topic:"cx", diff:2, title:"Cauchy–Riemann and harmonic conjugates",
  statement: String.raw`Verify that \( u(x,y) = x^2 - y^2 \) is harmonic, find a harmonic conjugate \( v \), and identify the analytic function \( f = u + iv \).`,
  hint: String.raw`Use the Cauchy–Riemann equations \( v_y = u_x \), \( v_x = -u_y \) and integrate.`,
  solution: String.raw`\( u_{xx} + u_{yy} = 2 - 2 = 0 \). \( \checkmark \) From \( v_y = u_x = 2x \): \( v = 2xy + g(x) \); then \( v_x = 2y + g'(x) = -u_y = 2y \) forces \( g' = 0 \). So \( v = 2xy \) (up to a constant) and
  \[ f(z) = x^2 - y^2 + 2ixy = (x+iy)^2 = z^2. \]` },

{ id:"X4", topic:"cx", diff:2, title:"Mapping by 1/z",
  statement: String.raw`Find the image of the vertical line \( \operatorname{Re} z = 1 \) under the map \( w = 1/z \).`,
  hint: String.raw`Write \( w = u + iv \) and express the condition \( \operatorname{Re}(1/w) = 1 \) in terms of \( u, v \).`,
  solution: String.raw`If \( w = 1/z \) then \( z = 1/w \) and \( \operatorname{Re}(1/w) = \frac{u}{u^2+v^2} = 1 \), i.e. \( u^2 + v^2 = u \), or
  \[ \left(u - \tfrac12\right)^2 + v^2 = \tfrac14. \]
  The line maps to the circle of radius \( \tfrac12 \) centered at \( \tfrac12 \), through the origin. Möbius maps always send lines and circles to lines and circles — the line's point at infinity lands at \( w = 0 \).` },

{ id:"X5", topic:"cx", diff:3, title:"Cauchy's integral formula",
  statement: String.raw`Evaluate \( \oint_{|z|=2} \frac{e^{z}}{z-1}\,dz \) and \( \oint_{|z|=2} \frac{e^{z}}{(z-1)^2}\,dz \), with the circle traversed counterclockwise.`,
  hint: String.raw`Both are immediate from Cauchy's integral formula \( f(a) = \frac{1}{2\pi i}\oint \frac{f(z)}{z-a}dz \) and its derivative version.`,
  solution: String.raw`Since \( e^z \) is entire and \( z = 1 \) lies inside \( |z| = 2 \):
  \[ \oint \frac{e^z}{z-1}dz = 2\pi i\, e^{1} = 2\pi i e, \qquad \oint \frac{e^z}{(z-1)^2}dz = 2\pi i \left. \frac{d}{dz}e^z \right|_{z=1} = 2\pi i e. \]
  The integral sees only local data at the singularity — the heart of why residues compute integrals.` },

{ id:"X6", topic:"cx", diff:3, title:"Laurent series in two regions",
  statement: String.raw`Expand \( f(z) = \dfrac{1}{z(z-1)} \) in a Laurent series valid in \( 0 \lt |z| \lt 1 \), and in one valid in \( |z| > 1 \).`,
  hint: String.raw`Partial fractions first: \( f = \frac{1}{z-1} - \frac{1}{z} \). Then expand \( \frac{1}{z-1} \) as a geometric series two ways, depending on whether \( |z| \lt 1 \) or \( |z| > 1 \).`,
  solution: String.raw`Partial fractions: \( f(z) = -\frac1z + \frac{1}{z-1} \).
  In \( 0 \lt |z| \lt 1 \): \( \frac{1}{z-1} = -\sum_{n\ge0} z^n \), so
  \[ f(z) = -\frac1z - 1 - z - z^2 - \cdots \]
  In \( |z| > 1 \): \( \frac{1}{z-1} = \frac{1}{z}\cdot\frac{1}{1 - 1/z} = \sum_{n\ge1} z^{-n} \), so
  \[ f(z) = -\frac1z + \frac1z + \frac{1}{z^2} + \frac{1}{z^3} + \cdots = \sum_{n\ge2} z^{-n}. \]
  Same function, different annulus, different series — and only the first expansion has a residue at the origin (\( -1 \), the coefficient of \( 1/z \)).` },

{ id:"X7", topic:"cx", diff:3, title:"Classifying singularities",
  statement: String.raw`Classify the singularity at \( z = 0 \) of \( f(z) = \dfrac{1 - \cos z}{z^4} \), and compute \( \operatorname{Res}_{z=0} f \).`,
  hint: String.raw`Expand \( \cos z \) in its Taylor series and divide. The residue is the coefficient of \( 1/z \).`,
  solution: String.raw`Since \( 1 - \cos z = \frac{z^2}{2} - \frac{z^4}{24} + \frac{z^6}{720} - \cdots \),
  \[ f(z) = \frac{1}{2z^{2}} - \frac{1}{24} + \frac{z^{2}}{720} - \cdots \]
  A pole of order 2 (not 4 — the numerator's zero cancels two powers). There is no \( 1/z \) term, so \( \operatorname{Res}_{z=0} f = 0 \). Moral: always expand before declaring the order of a pole, and a pole can have zero residue.` },

{ id:"X8", topic:"cx", diff:4, title:"Residues: a rational integral",
  statement: String.raw`Use the residue theorem to evaluate \( \int_{-\infty}^{\infty} \frac{dx}{(1+x^2)^2} \).`,
  hint: String.raw`Close the contour in the upper half-plane. The only enclosed singularity is a double pole at \( z = i \); use \( \operatorname{Res} = \lim_{z\to i}\frac{d}{dz}\left[(z-i)^2 f(z)\right] \).`,
  solution: String.raw`With \( f(z) = \frac{1}{(z^2+1)^2} = \frac{1}{(z-i)^2(z+i)^2} \), the semicircular arc contributes nothing as \( R \to \infty \) (the integrand decays like \( R^{-4} \)). At the double pole \( z = i \):
  \[ \operatorname{Res}_{z=i} f = \frac{d}{dz}\left.\frac{1}{(z+i)^2}\right|_{z=i} = \frac{-2}{(2i)^3} = \frac{-2}{-8i} = \frac{1}{4i}. \]
  Therefore
  \[ \int_{-\infty}^\infty \frac{dx}{(1+x^2)^2} = 2\pi i \cdot \frac{1}{4i} = \frac{\pi}{2}. \]` },

{ id:"X9", topic:"cx", diff:4, title:"Residues: a trigonometric integral",
  statement: String.raw`Evaluate \( \int_0^{2\pi} \frac{d\theta}{2 + \cos\theta} \).`,
  hint: String.raw`Set \( z = e^{i\theta} \), so \( \cos\theta = \frac{z + z^{-1}}{2} \) and \( d\theta = \frac{dz}{iz} \), converting to a contour integral over \( |z| = 1 \).`,
  solution: String.raw`The substitution gives
  \[ \int_0^{2\pi}\frac{d\theta}{2+\cos\theta} = \oint_{|z|=1} \frac{2\,dz}{i\left(z^2 + 4z + 1\right)}. \]
  The roots of \( z^2 + 4z + 1 \) are \( z = -2 \pm \sqrt3 \); only \( z_0 = -2 + \sqrt3 \) lies inside the unit circle. The residue of \( \frac{2}{i(z - z_0)(z - z_1)} \) there is \( \frac{2}{i(z_0 - z_1)} = \frac{2}{2\sqrt3\, i} = \frac{1}{\sqrt3 i} \). Hence the integral equals \( 2\pi i \cdot \frac{1}{\sqrt3 i} = \dfrac{2\pi}{\sqrt3} \). (In general \( \int_0^{2\pi}\frac{d\theta}{a + \cos\theta} = \frac{2\pi}{\sqrt{a^2-1}} \) for \( a > 1 \).)` },

{ id:"X10", topic:"cx", diff:4, title:"Jordan's lemma",
  statement: String.raw`Evaluate \( \int_{-\infty}^{\infty} \frac{\cos x}{x^2 + 1}\,dx \).`,
  hint: String.raw`Replace \( \cos x \) by \( e^{ix} \) (take the real part at the end). Jordan's lemma justifies closing in the upper half-plane, where \( e^{iz} \) decays.`,
  solution: String.raw`Consider \( \oint \frac{e^{iz}}{z^2+1}dz \) over the real axis plus an upper semicircle: \( |e^{iz}| = e^{-\operatorname{Im} z} \le 1 \) up there, and Jordan's lemma kills the arc. The simple pole at \( z = i \) has residue \( \frac{e^{i\cdot i}}{2i} = \frac{e^{-1}}{2i} \), so
  \[ \int_{-\infty}^\infty \frac{e^{ix}}{x^2+1}dx = 2\pi i\cdot\frac{e^{-1}}{2i} = \frac{\pi}{e}, \]
  and taking the real part: \( \int_{-\infty}^{\infty} \frac{\cos x}{x^2+1}dx = \dfrac{\pi}{e} \). Closing with \( e^{iz} \) rather than \( \cos z \) is essential: \( \cos z \) blows up in both half-planes.` },

{ id:"X11", topic:"cx", diff:5, title:"A keyhole contour",
  statement: String.raw`For \( 0 \lt a \lt 1 \), show that
  \[ \int_0^{\infty} \frac{x^{a-1}}{1+x}\,dx = \frac{\pi}{\sin \pi a}. \]`,
  hint: String.raw`Integrate \( \frac{z^{a-1}}{1+z} \) around a keyhole contour with the branch cut along the positive real axis, where \( z^{a-1} = e^{(a-1)\log z} \) with \( 0 \lt \arg z \lt 2\pi \). The two sides of the cut differ by a factor \( e^{2\pi i (a-1)} \).`,
  solution: String.raw`On the keyhole, the large and small circular arcs vanish: their contributions are \( O\!\left(R^{a-1}\right) \) and \( O\!\left(\epsilon^{a}\right) \) respectively, both tending to zero since \( 0 \lt a \lt 1 \). Above the cut the integral is \( I = \int_0^\infty \frac{x^{a-1}}{1+x}dx \); below the cut, \( z^{a-1} \) picks up \( e^{2\pi i(a-1)} = e^{2\pi i a} \) and the orientation reverses, contributing \( -e^{2\pi i a} I \). The only pole, at \( z = -1 = e^{i\pi} \), has residue \( e^{i\pi(a-1)} = -e^{i\pi a} \). So
  \[ \left(1 - e^{2\pi i a}\right) I = 2\pi i\left(-e^{i\pi a}\right) \implies I = \frac{-2\pi i\,e^{i\pi a}}{1 - e^{2\pi i a}} = \frac{2\pi i}{e^{i\pi a} - e^{-i\pi a}} = \frac{\pi}{\sin\pi a}. \]
  This is also the reflection formula \( \Gamma(a)\Gamma(1-a) = \pi/\sin\pi a \) in disguise (the integral is the Beta function \( B(a, 1-a) \)).` },

{ id:"X12", topic:"cx", diff:5, title:"Rouché's theorem",
  statement: String.raw`How many zeros (with multiplicity) does \( p(z) = z^5 + 3z + 1 \) have inside the unit disk \( |z| \lt 1 \)? Inside \( |z| \lt 2 \)?`,
  hint: String.raw`On each circle, split \( p \) into a dominant piece and a small piece, and apply Rouché: if \( |f - g| \lt |g| \) on the contour, then \( f \) and \( g \) have equally many zeros inside.`,
  solution: String.raw`On \( |z| = 1 \): take \( g(z) = 3z \). Then \( |p - g| = |z^5 + 1| \le 2 \lt 3 = |g| \), so \( p \) has the same number of zeros as \( 3z \) in the disk: exactly one.
  On \( |z| = 2 \): take \( g(z) = z^5 \). Then \( |p - g| = |3z + 1| \le 7 \lt 32 = |g| \), so \( p \) has all five zeros in \( |z| \lt 2 \).
  Hence four zeros lie in the annulus \( 1 \lt |z| \lt 2 \). Rouché — counting zeros by comparing against a dominant term — is the standard tool for locating spectra and proving stability results.` },

{ id:"X13", topic:"cx", diff:4, title:"A conformal map to the disk",
  statement: String.raw`Show that the Möbius transformation \( w = \dfrac{z - i}{z + i} \) maps the upper half-plane \( \operatorname{Im} z > 0 \) conformally onto the unit disk \( |w| \lt 1 \). Where does the real axis go, and where does \( z = i \) land?`,
  hint: String.raw`Compare \( |z - i| \) and \( |z + i| \): which is smaller when \( z \) is above the real axis?`,
  solution: String.raw`\( |w| = \frac{|z-i|}{|z+i|} \) compares the distance from \( z \) to \( i \) with the distance to \( -i \). Points in the upper half-plane are strictly closer to \( i \) than to \( -i \), so \( |w| \lt 1 \); points on the real axis are equidistant, so \( |w| = 1 \). The map is a Möbius transformation, hence conformal and invertible, and it sends \( i \mapsto 0 \), \( 0 \mapsto -1 \), \( \infty \mapsto 1 \).
  This "Cayley transform" is the standard bridge between half-plane and disk problems — e.g., transplanting the Poisson kernel from one domain to the other.` },

// ================= FOURIER & TRANSFORMS =================
{ id:"F1", topic:"ft", diff:2, title:"Fourier series of a square wave",
  statement: String.raw`Find the Fourier series of the \( 2\pi \)-periodic square wave \( f(x) = 1 \) for \( 0 \lt x \lt \pi \), \( f(x) = -1 \) for \( -\pi \lt x \lt 0 \). What does the series converge to at \( x = 0 \)?`,
  hint: String.raw`The function is odd, so only sine terms survive. Compute \( b_n = \frac{2}{\pi}\int_0^\pi \sin nx\,dx \).`,
  solution: String.raw`Oddness kills all \( a_n \). For the sines:
  \[ b_n = \frac{2}{\pi}\int_0^\pi \sin nx\,dx = \frac{2}{\pi n}\left(1 - (-1)^n\right) = \begin{cases} \dfrac{4}{\pi n}, & n \text{ odd} \\ 0, & n \text{ even.} \end{cases} \]
  \[ f(x) = \frac{4}{\pi}\left( \sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \cdots \right) \]
  At the jump \( x = 0 \), the series converges to the average \( \frac{f(0^+) + f(0^-)}{2} = 0 \) (Dirichlet's theorem). Partial sums also overshoot by about 9% near the jump — the Gibbs phenomenon.` },

{ id:"F2", topic:"ft", diff:3, title:"Fourier series and the Basel problem",
  statement: String.raw`Compute the Fourier series of \( f(x) = x^2 \) on \( (-\pi, \pi) \), and use it to prove \( \sum_{n=1}^{\infty}\frac{1}{n^2} = \frac{\pi^2}{6} \).`,
  hint: String.raw`The function is even; integrate by parts twice for \( a_n \). Then evaluate the series at \( x = \pi \), where it converges to \( \pi^2 \) (the function is continuous there).`,
  solution: String.raw`\( a_0 = \frac{1}{\pi}\int_{-\pi}^{\pi}x^2 dx = \frac{2\pi^2}{3} \), and two integrations by parts give \( a_n = \frac{4(-1)^n}{n^2} \), \( b_n = 0 \):
  \[ x^2 = \frac{\pi^2}{3} + 4\sum_{n=1}^{\infty}\frac{(-1)^n}{n^2}\cos nx. \]
  At \( x = \pi \): \( \pi^2 = \frac{\pi^2}{3} + 4\sum \frac{1}{n^2} \), so \( \sum_{n\ge1} \frac{1}{n^2} = \frac{\pi^2}{6} \). (Parseval applied to the same series gives \( \sum n^{-4} = \pi^4/90 \) for free.)` },

{ id:"F3", topic:"ft", diff:3, title:"Fourier transform of a two-sided exponential",
  statement: String.raw`Using the convention \( \hat f(\omega) = \int_{-\infty}^{\infty} f(x)\,e^{-i\omega x}\,dx \), compute the Fourier transform of \( f(x) = e^{-a|x|} \) with \( a > 0 \).`,
  hint: String.raw`Split the integral at \( x = 0 \); each half is an elementary exponential integral. The answer should be real and even — why?`,
  solution: String.raw`\[ \hat f(\omega) = \int_{-\infty}^{0} e^{(a - i\omega)x}dx + \int_0^{\infty} e^{-(a + i\omega)x}dx = \frac{1}{a - i\omega} + \frac{1}{a + i\omega} = \frac{2a}{a^2 + \omega^2}. \]
  Real and even because \( f \) is real and even. This transform pair (exponential \( \leftrightarrow \) Lorentzian) is the engine behind the Poisson-summation problem later in this set.` },

{ id:"F4", topic:"ft", diff:4, title:"The Gaussian is its own transform",
  statement: String.raw`Show that \( f(x) = e^{-x^2/2} \) satisfies \( \hat f(\omega) = \sqrt{2\pi}\,e^{-\omega^2/2} \) (same convention as above) — i.e., the Gaussian is an eigenfunction of the Fourier transform.`,
  hint: String.raw`Either complete the square in the exponent and shift the contour, or derive and solve a first-order ODE for \( \hat f(\omega) \) by differentiating under the integral.`,
  solution: String.raw`ODE method: differentiating under the integral and integrating by parts,
  \[ \hat f'(\omega) = \int -ix\,e^{-x^2/2} e^{-i\omega x} dx = i\int \left(e^{-x^2/2}\right)' e^{-i\omega x}dx = -\omega \hat f(\omega). \]
  So \( \hat f(\omega) = \hat f(0)\,e^{-\omega^2/2} \), and \( \hat f(0) = \int e^{-x^2/2}dx = \sqrt{2\pi} \) (Gaussian integral).
  Hence wide Gaussians transform to narrow ones and vice versa — the cleanest statement of the uncertainty principle, and the reason the heat kernel is Gaussian.` },

{ id:"F5", topic:"ft", diff:2, title:"Laplace transforms from the definition",
  statement: String.raw`From the definition \( \mathcal{L}\{f\}(s) = \int_0^{\infty} f(t)e^{-st}\,dt \), compute \( \mathcal{L}\{e^{at}\} \) and \( \mathcal{L}\{t^n\} \) (for integer \( n \ge 0 \)), stating where each converges.`,
  hint: String.raw`The first is a single exponential integral. For the second, integrate by parts to find a recursion in \( n \), or substitute \( u = st \) and recognize the Gamma function.`,
  solution: String.raw`\( \mathcal{L}\{e^{at}\} = \int_0^\infty e^{-(s-a)t}dt = \dfrac{1}{s-a} \) for \( s > a \).
  With \( u = st \): \( \mathcal{L}\{t^n\} = \frac{1}{s^{n+1}}\int_0^\infty u^n e^{-u}du = \dfrac{n!}{s^{n+1}} \) for \( s > 0 \) (and \( \Gamma(p+1)/s^{p+1} \) for non-integer powers).` },

{ id:"F6", topic:"ft", diff:3, title:"Laplace transform solves an IVP",
  statement: String.raw`Use the Laplace transform to solve \( y'' + 4y = 8,\quad y(0) = 0,\; y'(0) = 0 \).`,
  hint: String.raw`Transform the equation using \( \mathcal{L}\{y''\} = s^2 Y - sy(0) - y'(0) \), then split \( Y(s) \) by partial fractions.`,
  solution: String.raw`Transforming: \( (s^2 + 4)Y = \frac{8}{s} \), so
  \[ Y(s) = \frac{8}{s(s^2+4)} = \frac{2}{s} - \frac{2s}{s^2+4} \implies y(t) = 2 - 2\cos 2t. \]
  Check: \( y'' = 8\cos 2t \) and \( 4y = 8 - 8\cos2t \); their sum is 8, with \( y(0) = y'(0) = 0 \). \( \checkmark \)` },

{ id:"F7", topic:"ft", diff:4, title:"Convolution theorem",
  statement: String.raw`Invert \( Y(s) = \dfrac{1}{s^2 (s+1)} \) two ways: by partial fractions, and via the convolution theorem \( \mathcal{L}^{-1}\{F G\} = f * g \).`,
  hint: String.raw`Take \( F = 1/s^2 \) (i.e. \( f(t) = t \)) and \( G = 1/(s+1) \) (i.e. \( g(t) = e^{-t} \)); compute \( \int_0^t (t - \tau)e^{-\tau}d\tau \).`,
  solution: String.raw`Convolution: \( (f*g)(t) = \int_0^t (t-\tau)e^{-\tau}d\tau = t\left(1 - e^{-t}\right) - \left(1 - (1+t)e^{-t}\right) = t - 1 + e^{-t}. \)
  Partial fractions: \( \frac{1}{s^2(s+1)} = \frac{1}{s^2} - \frac{1}{s} + \frac{1}{s+1} \), which inverts to the same \( t - 1 + e^{-t} \). \( \checkmark \)
  The convolution form is what generalizes: the response of a linear system is the input convolved with the impulse response — see the next problem.` },

{ id:"F8", topic:"ft", diff:4, title:"Impulse response",
  statement: String.raw`Solve \( y'' + y = \delta(t - \pi),\quad y(0) = y'(0) = 0 \), and interpret the solution physically.`,
  hint: String.raw`\( \mathcal{L}\{\delta(t-\pi)\} = e^{-\pi s} \), and \( e^{-as}F(s) \) inverts to a shifted, switched-on copy of \( f \).`,
  solution: String.raw`Transforming: \( (s^2 + 1)Y = e^{-\pi s} \), so \( Y = \frac{e^{-\pi s}}{s^2 + 1} \) and the shift theorem gives
  \[ y(t) = H(t-\pi)\,\sin(t - \pi) = -H(t-\pi)\sin t, \]
  where \( H \) is the Heaviside step. The oscillator sits at rest until it is struck at \( t = \pi \), then rings at unit amplitude. The function \( G(t) = H(t)\sin t \) is the causal Green's function of \( y'' + y \): the response to any forcing \( f \) is \( y = G * f \).` },

{ id:"F9", topic:"ft", diff:4, title:"Plancherel and the sinc integral",
  statement: String.raw`Use Plancherel's theorem \( \int |f|^2 dx = \frac{1}{2\pi}\int |\hat f|^2 d\omega \) to evaluate
  \[ \int_{-\infty}^{\infty} \frac{\sin^2 x}{x^2}\,dx. \]`,
  hint: String.raw`Find the function whose Fourier transform is \( \frac{2\sin\omega}{\omega} \): the indicator (box) function of \( [-1, 1] \).`,
  solution: String.raw`For the box \( f = \mathbf{1}_{[-1,1]} \): \( \hat f(\omega) = \int_{-1}^1 e^{-i\omega x}dx = \frac{2\sin\omega}{\omega} \). Plancherel gives
  \[ \int_{-\infty}^\infty |f|^2 dx = 2 = \frac{1}{2\pi}\int_{-\infty}^\infty \frac{4\sin^2\omega}{\omega^2}d\omega \implies \int_{-\infty}^\infty \frac{\sin^2\omega}{\omega^2}d\omega = \pi. \]
  A contour-integration-free evaluation — energy conservation between a function and its transform doing the work.` },

{ id:"F10", topic:"ft", diff:5, title:"Heat equation on the line via Fourier transform",
  statement: String.raw`Solve \( u_t = k\,u_{xx} \) on \( -\infty \lt x \lt \infty \) with \( u(x,0) = f(x) \) by Fourier transforming in \( x \), and derive the heat-kernel representation of the solution.`,
  hint: String.raw`The transform converts the PDE to an ODE in \( t \) for each frequency: \( \hat u_t = -k\omega^2 \hat u \). Invert the resulting Gaussian multiplier using the convolution theorem and the Gaussian transform pair.`,
  solution: String.raw`Transforming in \( x \): \( \hat u_t = -k\omega^2 \hat u \), so \( \hat u(\omega, t) = \hat f(\omega)\,e^{-k\omega^2 t} \).
  Since multiplication of transforms is convolution, and the inverse transform of \( e^{-k\omega^2 t} \) is the Gaussian \( \frac{1}{\sqrt{4\pi k t}}e^{-x^2/4kt} \) (Gaussian pair, rescaled),
  \[ u(x,t) = \int_{-\infty}^{\infty} \frac{e^{-(x-y)^2/4kt}}{\sqrt{4\pi k t}}\,f(y)\,dy. \]
  The heat kernel spreads with width \( \sqrt{2kt} \): initial data are smoothed instantly, high frequencies dying at rate \( e^{-k\omega^2 t} \). This one calculation contains smoothing, infinite propagation speed, and the \( \sqrt{t} \) diffusive scaling.` },

{ id:"F11", topic:"ft", diff:5, title:"Poisson summation",
  statement: String.raw`The Poisson summation formula states \( \sum_{n\in\mathbb{Z}} f(n) = \sum_{k\in\mathbb{Z}} \hat f(2\pi k) \). Use it with \( f(x) = \dfrac{1}{x^2 + a^2} \) to show
  \[ \sum_{n=-\infty}^{\infty} \frac{1}{n^2 + a^2} = \frac{\pi}{a}\coth(\pi a), \quad a > 0. \]`,
  hint: String.raw`By Fourier inversion of the pair in the two-sided-exponential problem, \( \hat f(\omega) = \frac{\pi}{a}e^{-a|\omega|} \). The right-hand sum becomes geometric.`,
  solution: String.raw`From \( \widehat{e^{-a|x|}} = \frac{2a}{a^2+\omega^2} \) and Fourier inversion (with symmetry), \( f(x) = \frac{1}{x^2+a^2} \) has \( \hat f(\omega) = \frac{\pi}{a}e^{-a|\omega|} \). Poisson summation then gives
  \[ \sum_{n} \frac{1}{n^2+a^2} = \frac{\pi}{a}\sum_{k} e^{-2\pi a|k|} = \frac{\pi}{a}\left( 1 + \frac{2e^{-2\pi a}}{1 - e^{-2\pi a}} \right) = \frac{\pi}{a}\cdot\frac{1 + e^{-2\pi a}}{1 - e^{-2\pi a}} = \frac{\pi}{a}\coth(\pi a). \]
  As \( a \to 0 \), both sides behave like \( \frac{1}{a^2} + \frac{\pi^2}{3} + O(a^2) \), recovering \( \sum_{n\ge1} n^{-2} = \pi^2/6 \) — Basel again, by a completely different route.` },

{ id:"F12", topic:"ft", diff:3, title:"Transform calculus: derivative and shift rules",
  statement: String.raw`Prove the two basic operational rules of the Fourier transform: (a) \( \widehat{f'}(\omega) = i\omega\,\hat f(\omega) \) for \( f \) decaying at infinity, and (b) \( \widehat{f(x - c)}(\omega) = e^{-i\omega c}\hat f(\omega) \). Why does (a) make the Fourier transform so effective on constant-coefficient ODEs and PDEs?`,
  hint: String.raw`(a) is one integration by parts; (b) is one change of variables.`,
  solution: String.raw`(a) Integrating by parts, with the boundary terms vanishing by decay:
  \[ \int f'(x)e^{-i\omega x}dx = \left[f e^{-i\omega x}\right]_{-\infty}^{\infty} + i\omega\int f e^{-i\omega x}dx = i\omega \hat f(\omega). \]
  (b) Substituting \( y = x - c \): \( \int f(x-c)e^{-i\omega x}dx = e^{-i\omega c}\int f(y)e^{-i\omega y}dy = e^{-i\omega c}\hat f(\omega) \).
  Rule (a) turns differentiation into multiplication by \( i\omega \): every constant-coefficient differential operator becomes a polynomial multiplier, converting ODEs to algebra and PDEs to ODEs — exactly the move used to solve the heat equation on the line.` },

// ================= PARTIAL DIFFERENTIAL EQUATIONS =================
{ id:"P1", topic:"pde", diff:2, title:"Classifying second-order PDEs",
  statement: String.raw`Classify each equation as elliptic, parabolic, or hyperbolic:
  (a) \( u_{xx} + 4u_{xy} + u_{yy} = 0 \); (b) \( u_{xx} + 2u_{xy} + u_{yy} = 0 \); (c) \( u_{xx} + u_{yy} = 0 \).`,
  hint: String.raw`For \( A u_{xx} + 2B u_{xy} + C u_{yy} + \cdots \), compute the discriminant \( B^2 - AC \): positive means hyperbolic, zero parabolic, negative elliptic.`,
  solution: String.raw`(a) \( A = C = 1,\, B = 2 \): \( B^2 - AC = 3 > 0 \) — hyperbolic (wave-like, two characteristic families).
  (b) \( B = 1 \): \( B^2 - AC = 0 \) — parabolic (diffusion-like, one characteristic family).
  (c) \( B = 0 \): \( B^2 - AC = -1 \lt 0 \) — elliptic (Laplace-like, no real characteristics).
  The type dictates everything: what data are appropriate, whether information propagates at finite speed, and whether solutions smooth out.` },

{ id:"P2", topic:"pde", diff:2, title:"Checking harmonicity",
  statement: String.raw`Show that \( u(x,y) = \ln\left(x^2 + y^2\right) \) is harmonic on the punctured plane \( (x,y) \neq (0,0) \). Why is this function special among radial solutions of Laplace's equation in 2D?`,
  hint: String.raw`Compute \( u_{xx} + u_{yy} \) directly, or use the radial form \( \Delta u = u_{rr} + \frac{1}{r}u_r \) with \( u = 2\ln r \).`,
  solution: String.raw`With \( r^2 = x^2 + y^2 \): \( u_x = \frac{2x}{r^2} \), \( u_{xx} = \frac{2}{r^2} - \frac{4x^2}{r^4} \), and symmetrically in \( y \). Adding:
  \[ \Delta u = \frac{4}{r^2} - \frac{4(x^2+y^2)}{r^4} = 0. \]
  Radial harmonic functions in 2D satisfy \( u_{rr} + \frac1r u_r = 0 \), an Euler equation with solutions \( u = a + b\ln r \): up to scaling, \( \ln r \) is the fundamental solution of the 2D Laplacian — the building block of Green's functions, with \( \Delta\left(\frac{1}{2\pi}\ln r\right) = \delta \) in the distributional sense.` },

{ id:"P3", topic:"pde", diff:3, title:"Heat equation by separation of variables",
  statement: String.raw`Solve \( u_t = k\,u_{xx} \) on \( 0 \lt x \lt L \) with \( u(0,t) = u(L,t) = 0 \) and \( u(x,0) = f(x) \). Then write the explicit solution when \( f(x) = \sin\!\left(\frac{\pi x}{L}\right) \).`,
  hint: String.raw`Seek \( u = X(x)T(t) \); the boundary conditions give the Dirichlet eigenfunctions \( \sin\frac{n\pi x}{L} \). Superpose with coefficients from the Fourier sine series of \( f \).`,
  solution: String.raw`Separation gives \( \frac{T'}{kT} = \frac{X''}{X} = -\lambda \). The eigenvalue problem \( X'' + \lambda X = 0,\; X(0) = X(L) = 0 \) has \( \lambda_n = \left(\frac{n\pi}{L}\right)^2,\, X_n = \sin\frac{n\pi x}{L} \), so
  \[ u(x,t) = \sum_{n=1}^{\infty} b_n\, e^{-k\left(\frac{n\pi}{L}\right)^2 t} \sin\frac{n\pi x}{L}, \qquad b_n = \frac{2}{L}\int_0^L f(x)\sin\frac{n\pi x}{L}dx. \]
  For \( f = \sin\frac{\pi x}{L} \), only \( b_1 = 1 \) survives:
  \[ u(x,t) = e^{-k\pi^2 t/L^2}\,\sin\frac{\pi x}{L}. \]
  Each mode decays at rate \( k\lambda_n \) — high frequencies die fastest, which is why heat flow smooths.` },

{ id:"P4", topic:"pde", diff:3, title:"d'Alembert's formula",
  statement: String.raw`Derive d'Alembert's solution of the wave equation \( u_{tt} = c^2 u_{xx} \) on the whole line with \( u(x,0) = f(x) \), \( u_t(x,0) = g(x) \).`,
  hint: String.raw`Factor the operator: \( (\partial_t - c\partial_x)(\partial_t + c\partial_x)u = 0 \), so \( u = F(x - ct) + G(x + ct) \). Then fit \( F, G \) to the initial data.`,
  solution: String.raw`The general solution is a right-mover plus a left-mover: \( u = F(x-ct) + G(x+ct) \). The initial conditions give \( F + G = f \) and \( -cF' + cG' = g \). Integrating the second: \( G - F = \frac1c \int_0^x g \,+\, \) const, and solving:
  \[ u(x,t) = \frac{f(x-ct) + f(x+ct)}{2} + \frac{1}{2c}\int_{x-ct}^{x+ct} g(s)\,ds. \]
  The value at \( (x,t) \) depends only on data in \( [x - ct, x + ct] \): finite propagation speed, sharp contrast with the heat equation's instantaneous spreading.` },

{ id:"P5", topic:"pde", diff:3, title:"Laplace's equation on a rectangle",
  statement: String.raw`Solve \( \Delta u = 0 \) on the rectangle \( 0 \lt x \lt a,\; 0 \lt y \lt b \) with \( u = 0 \) on the bottom and sides, and \( u(x, b) = f(x) \) on the top.`,
  hint: String.raw`Separate variables; the homogeneous conditions in \( x \) select \( \sin\frac{n\pi x}{a} \), and the condition \( u(x,0)=0 \) selects \( \sinh\frac{n\pi y}{a} \) over \( \cosh \).`,
  solution: String.raw`With \( u = X(x)Y(y) \), the \( x \)-problem gives \( X_n = \sin\frac{n\pi x}{a} \), and then \( Y'' = \left(\frac{n\pi}{a}\right)^2 Y \) with \( Y(0) = 0 \) gives \( Y_n = \sinh\frac{n\pi y}{a} \). Superposing and matching the top boundary:
  \[ u(x,y) = \sum_{n=1}^{\infty} b_n \frac{\sinh\left(n\pi y/a\right)}{\sinh\left(n\pi b/a\right)} \sin\frac{n\pi x}{a}, \qquad b_n = \frac{2}{a}\int_0^a f(x)\sin\frac{n\pi x}{a}\,dx. \]
  Note the interior decay: the \( n \)-th mode is damped by roughly \( e^{-n\pi(b-y)/a} \) away from the data — elliptic problems forget boundary detail exponentially fast.` },

{ id:"P6", topic:"pde", diff:4, title:"Laplace's equation on a disk",
  statement: String.raw`Solve \( \Delta u = 0 \) in the unit disk with boundary data \( u(1, \theta) = \sin^2\theta \).`,
  hint: String.raw`Bounded solutions in the disk are \( u = \frac{a_0}{2} + \sum r^n (a_n \cos n\theta + b_n \sin n\theta) \). Rewrite \( \sin^2\theta \) with a double-angle identity to read off the coefficients.`,
  solution: String.raw`Since \( \sin^2\theta = \frac12 - \frac12\cos 2\theta \), the boundary data contain only the \( n = 0 \) and \( n = 2 \) cosine modes. Matching term by term:
  \[ u(r,\theta) = \frac{1}{2} - \frac{r^2}{2}\cos 2\theta \;=\; \frac{1}{2} - \frac{x^2 - y^2}{2}. \]
  Sanity checks: it is a harmonic polynomial; at \( r = 1 \) it reproduces \( \sin^2\theta \); and its value at the center, \( \frac12 \), equals the boundary average — the mean value property in action.` },

{ id:"P7", topic:"pde", diff:4, title:"Method of characteristics (linear)",
  statement: String.raw`Solve the transport equation \( u_t + 2u_x = 0 \) with \( u(x, 0) = \varphi(x) \) by the method of characteristics, and describe the geometry of the solution.`,
  hint: String.raw`Along which curves \( x(t) \) is \( \frac{d}{dt}u(x(t), t) = 0 \)?`,
  solution: String.raw`Along a curve \( x(t) \), \( \frac{d}{dt}u(x(t),t) = u_t + \dot x\,u_x \), which vanishes when \( \dot x = 2 \). So \( u \) is constant on the characteristic lines \( x = x_0 + 2t \), and
  \[ u(x,t) = \varphi(x - 2t): \]
  the initial profile translating rigidly to the right at speed 2. First-order PDEs are ODEs in disguise — solved by following characteristics.` },

{ id:"P8", topic:"pde", diff:5, title:"Burgers' equation and shock formation",
  statement: String.raw`Solve \( u_t + u\,u_x = 0 \) with \( u(x,0) = -x \) by characteristics. Show that the solution blows up in finite time, and find the blow-up time. For general initial data \( u_0(x) \), when does the first shock form?`,
  hint: String.raw`Characteristics are straight lines \( x = x_0 + u_0(x_0)\,t \) carrying the constant value \( u_0(x_0) \). A shock forms when characteristics first cross.`,
  solution: String.raw`Characteristics: \( x = x_0 - x_0 t = x_0(1 - t) \), carrying \( u = -x_0 \). Solving for \( x_0 \):
  \[ u(x,t) = -\frac{x}{1 - t}, \]
  valid for \( t \lt 1 \). At \( t = 1 \) every characteristic passes through \( x = 0 \) simultaneously: the gradient \( u_x = -\frac{1}{1-t} \) blows up. 
  In general, characteristics from \( x_0 \) and nearby points cross when \( 1 + u_0'(x_0)t = 0 \), so the first shock forms at
  \[ t^{*} = \frac{-1}{\min_{x_0} u_0'(x_0)}, \]
  finite whenever \( u_0 \) is somewhere decreasing. Beyond \( t^* \) the classical solution dies and one continues with weak solutions and the Rankine–Hugoniot jump condition — the gateway to conservation-law theory.` },

{ id:"P9", topic:"pde", diff:4, title:"Energy method: uniqueness",
  statement: String.raw`Use an energy argument to prove that the initial–boundary value problem \( u_t = k u_{xx} \) on \( (0, L) \), with \( u(0,t), u(L,t) \) and \( u(x,0) \) all prescribed, has at most one (smooth) solution.`,
  hint: String.raw`Let \( w \) be the difference of two solutions, define \( E(t) = \int_0^L w^2\,dx \), and show \( E' \le 0 \) using integration by parts.`,
  solution: String.raw`If \( u_1, u_2 \) both solve the problem, \( w = u_1 - u_2 \) satisfies the heat equation with zero boundary and initial data. Let \( E(t) = \int_0^L w^2 dx \ge 0 \). Then
  \[ E'(t) = 2\int_0^L w\,w_t\,dx = 2k\int_0^L w\,w_{xx}\,dx = 2k\Big[ w w_x \Big]_0^L - 2k\int_0^L w_x^2\,dx = -2k\int_0^L w_x^2\,dx \le 0, \]
  the boundary term vanishing since \( w = 0 \) at both ends. With \( E(0) = 0 \), \( E \ge 0 \), and \( E' \le 0 \), we get \( E \equiv 0 \), so \( w \equiv 0 \). Energy methods need no solution formula — they extend to variable coefficients and higher dimensions where separation of variables fails.` },

{ id:"P10", topic:"pde", diff:5, title:"Green's function for a boundary value problem",
  statement: String.raw`Construct the Green's function for \( -u'' = f(x) \) on \( (0,1) \) with \( u(0) = u(1) = 0 \), and write the solution formula. Verify it for \( f \equiv 1 \).`,
  hint: String.raw`\( G(x,\xi) \) solves \( -G'' = \delta(x - \xi) \) with the same boundary conditions: linear in \( x \) on each side of \( \xi \), continuous at \( \xi \), with a slope jump of \( -1 \) across it.`,
  solution: String.raw`Piecing together linear functions that vanish at the endpoints, with continuity at \( x = \xi \) and jump condition \( G'(\xi^+) - G'(\xi^-) = -1 \):
  \[ G(x,\xi) = \begin{cases} x(1-\xi), & 0 \le x \le \xi, \\ \xi(1-x), & \xi \le x \le 1, \end{cases} \qquad u(x) = \int_0^1 G(x,\xi)\,f(\xi)\,d\xi. \]
  Note the symmetry \( G(x,\xi) = G(\xi,x) \) — self-adjointness made visible. For \( f \equiv 1 \):
  \[ u(x) = \int_0^x \xi(1-x)d\xi + \int_x^1 x(1-\xi)d\xi = \frac{x^2(1-x)}{2} + \frac{x(1-x)^2}{2} = \frac{x(1-x)}{2}, \]
  which indeed satisfies \( -u'' = 1 \) and the boundary conditions. \( \checkmark \) The Green's function turns a differential operator into an explicit integral operator — the continuous analogue of inverting a matrix.` },

{ id:"P11", topic:"pde", diff:5, title:"Similarity solution of the heat equation",
  statement: String.raw`Solve \( u_t = k u_{xx} \) on the whole line with step initial data \( u(x,0) = 0 \) for \( x \lt 0 \) and \( u(x,0) = 1 \) for \( x > 0 \), by seeking a similarity solution \( u = U(\eta) \) with \( \eta = \dfrac{x}{\sqrt{4kt}} \).`,
  hint: String.raw`The problem has no intrinsic length scale, so the solution can depend on \( x \) and \( t \) only through the dimensionless \( \eta \). Substituting reduces the PDE to \( U'' + 2\eta U' = 0 \).`,
  solution: String.raw`Substituting \( u = U(\eta) \) into the PDE gives \( U'' + 2\eta U' = 0 \), so \( U' = Ce^{-\eta^2} \) and
  \[ U(\eta) = A + B\operatorname{erf}(\eta), \qquad \operatorname{erf}(\eta) = \frac{2}{\sqrt\pi}\int_0^{\eta} e^{-s^2}ds. \]
  The conditions \( U(-\infty) = 0,\, U(+\infty) = 1 \) give \( A = B = \frac12 \):
  \[ u(x,t) = \frac{1}{2}\left[ 1 + \operatorname{erf}\!\left( \frac{x}{\sqrt{4kt}} \right) \right]. \]
  The interface spreads like \( \sqrt{kt} \) — the diffusive scaling law. Dimensional analysis found the reduction before any hard analysis happened; this is the same solution the heat kernel gives by integrating Gaussians.` },

{ id:"P12", topic:"pde", diff:5, title:"The vibrating circular membrane",
  statement: String.raw`For the wave equation \( u_{tt} = c^2 \Delta u \) on the unit disk with \( u = 0 \) on the boundary, find the radially symmetric normal modes and the equation determining their frequencies.`,
  hint: String.raw`Separate \( u = R(r)T(t) \). The radial equation is Bessel's equation of order zero; boundedness at \( r = 0 \) selects \( J_0 \).`,
  solution: String.raw`Writing \( u = R(r)\,T(t) \) with \( T'' = -c^2\lambda T \), the radial part satisfies
  \[ R'' + \frac{1}{r}R' + \lambda R = 0, \]
  Bessel's equation of order zero in \( \sqrt{\lambda}\,r \). The solution bounded at the center is \( R = J_0(\sqrt\lambda\, r) \) (the second solution \( Y_0 \) blows up at \( r=0 \)). The boundary condition \( J_0(\sqrt\lambda) = 0 \) quantizes the eigenvalues: \( \sqrt{\lambda_m} = j_{0,m} \), the \( m \)-th positive zero of \( J_0 \) (\( j_{0,1} \approx 2.405,\; j_{0,2} \approx 5.520 \)). The modes are
  \[ u_m(r,t) = J_0\!\left( j_{0,m}\, r \right)\left[ a_m\cos\left( c\,j_{0,m} t \right) + b_m \sin\left( c\,j_{0,m} t \right) \right]. \]
  Unlike a string, the frequencies \( c\,j_{0,m} \) are not integer multiples of the fundamental — which is why a drum sounds inharmonic. Special functions are not exotic here; they are simply the eigenfunctions geometry forces on you.` },

{ id:"P13", topic:"pde", diff:4, title:"Forced heat equation by eigenfunction expansion",
  statement: String.raw`Solve \( u_t = u_{xx} + \sin(\pi x) \) on \( 0 \lt x \lt 1 \) with \( u(0,t) = u(1,t) = 0 \) and \( u(x,0) = 0 \), and identify the steady state.`,
  hint: String.raw`Expand \( u(x,t) = \sum_n c_n(t)\sin(n\pi x) \). The forcing lives entirely in the \( n = 1 \) mode, so only one ODE is nontrivial.`,
  solution: String.raw`Projecting onto \( \sin(n\pi x) \): \( c_n' = -(n\pi)^2 c_n + \delta_{n,1} \) with \( c_n(0) = 0 \). For \( n \ge 2 \), \( c_n \equiv 0 \); for \( n = 1 \):
  \[ c_1' = -\pi^2 c_1 + 1 \implies c_1(t) = \frac{1 - e^{-\pi^2 t}}{\pi^2}. \]
  \[ u(x,t) = \frac{1 - e^{-\pi^2 t}}{\pi^2}\,\sin(\pi x) \;\xrightarrow[t\to\infty]{}\; \frac{\sin \pi x}{\pi^2}, \]
  the steady state solving \( -u_{xx} = \sin\pi x \). Direct check: \( u_t = e^{-\pi^2 t}\sin\pi x \), while \( u_{xx} = -\left(1 - e^{-\pi^2 t}\right)\sin\pi x \), so \( u_{xx} + \sin\pi x = e^{-\pi^2 t}\sin\pi x = u_t \). \( \checkmark \) Transient plus steady state — the generic anatomy of forced diffusion.` },
];

// ---------------------------------------------------------------
// SET GENERATION — stratified sample of 50, preserving the
// undergrad-to-graduate difficulty gradient
// ---------------------------------------------------------------
const SET_SIZE = 50;

function sampleSet(bank, size) {
  const byDiff = {};
  bank.forEach(p => { (byDiff[p.diff] = byDiff[p.diff] || []).push(p); });
  const diffs = Object.keys(byDiff).map(Number).sort((a, b) => a - b);
  const total = bank.length;
  // largest-remainder proportional allocation
  const quotas = diffs.map(d => {
    const exact = (byDiff[d].length * size) / total;
    return { d, base: Math.floor(exact), rem: exact - Math.floor(exact) };
  });
  let used = quotas.reduce((s, q) => s + q.base, 0);
  quotas.sort((a, b) => b.rem - a.rem);
  for (let i = 0; used < size && i < quotas.length; i++, used++) quotas[i].base++;
  const chosen = [];
  quotas.forEach(({ d, base }) => {
    const pool = [...byDiff[d]];
    // Fisher–Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    chosen.push(...pool.slice(0, Math.min(base, pool.length)));
  });
  // order: difficulty ascending, topics interleaved for variety
  chosen.sort((a, b) => a.diff - b.diff || a.id.localeCompare(b.id));
  const result = [];
  diffs.forEach(d => {
    const group = chosen.filter(p => p.diff === d);
    const byTopic = {};
    group.forEach(p => { (byTopic[p.topic] = byTopic[p.topic] || []).push(p); });
    const lists = Object.values(byTopic);
    let added = true;
    while (added) {
      added = false;
      lists.forEach(l => { if (l.length) { result.push(l.shift()); added = true; } });
    }
  });
  return result;
}

const PARTS = [
  { label: "Part I", name: "Foundations", range: "Undergraduate core", test: d => d <= 2 },
  { label: "Part II", name: "The Bridge", range: "Advanced undergraduate", test: d => d === 3 },
  { label: "Part III", name: "Graduate Methods", range: "Masters level", test: d => d >= 4 },
];

const DIFF_NAMES = { 1: "Warm-up", 2: "Core", 3: "Advanced", 4: "Graduate", 5: "Qualifier" };

// ---------------------------------------------------------------
// MATH RENDERING — MathJax loaded once, typeset per element
// ---------------------------------------------------------------
function useMathJaxLoader() {
  useEffect(() => {
    if (window.MathJax || document.getElementById("mathjax-script")) return;
    window.MathJax = {
      tex: { inlineMath: [["\\(", "\\)"]], displayMath: [["\\[", "\\]"]] },
      options: { enableMenu: false },
      startup: { typeset: false },
    };
    const s = document.createElement("script");
    s.id = "mathjax-script";
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-chtml.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);
}

function MathText({ tex, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Apply \displaystyle selectively: only to inline math that contains a
    // matrix, so matrices render at proper size with auto-sized delimiters.
    // Integrals, sums, and limits keep their natural inline typography
    // (compact symbol, sub/superscript bounds) instead of the oversized
    // display form, which produced awkward spacing.
    el.innerHTML = tex.replace(/\\\(([\s\S]*?)\\\)/g, (m, inner) =>
      /\\begin\{[pbvV]?matrix\}/.test(inner)
        ? "\\(\\displaystyle " + inner + "\\)"
        : m
    );
    let cancelled = false;
    const attempt = (n) => {
      if (cancelled) return;
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([el]).catch(() => {});
      } else if (n < 60) {
        setTimeout(() => attempt(n + 1), 250);
      }
    };
    attempt(0);
    return () => { cancelled = true; };
  }, [tex]);
  return <div ref={ref} className={className} />;
}

// ---------------------------------------------------------------
// PROBLEM CARD
// ---------------------------------------------------------------
function ProblemCard({ problem, number, solved, onToggleSolved }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  return (
    <article className={"card" + (solved ? " card-solved" : "")}>
      <header className="card-head">
        <div className="card-id">
          <span className="card-number">Problem {number}</span>
          <span className="card-topic">{TOPICS[problem.topic]}</span>
        </div>
        <div className="card-meta">
          <span className="diff" title={DIFF_NAMES[problem.diff] + " (level " + problem.diff + " of 5)"}>
            <span className="diff-on">{"\u222B".repeat(problem.diff)}</span>
            <span className="diff-off">{"\u222B".repeat(5 - problem.diff)}</span>
          </span>
          <span className="diff-name">{DIFF_NAMES[problem.diff]}</span>
        </div>
      </header>
      <h3 className="card-title">{problem.title}</h3>
      <MathText tex={problem.statement} className="statement" />
      <div className="card-actions">
        <button className={"btn" + (showHint ? " btn-active" : "")} onClick={() => setShowHint(v => !v)}>
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        <button className={"btn" + (showSolution ? " btn-active" : "")} onClick={() => setShowSolution(v => !v)}>
          {showSolution ? "Hide solution" : "Show solution"}
        </button>
        <button className={"btn btn-solve" + (solved ? " btn-solved" : "")} onClick={onToggleSolved}>
          {solved ? "\u2713 Solved" : "Mark solved"}
        </button>
      </div>
      {showHint && (
        <div className="reveal reveal-hint">
          <div className="reveal-label">Hint</div>
          <MathText tex={problem.hint} className="reveal-body" />
        </div>
      )}
      {showSolution && (
        <div className="reveal reveal-solution">
          <div className="reveal-label">Solution</div>
          <MathText tex={problem.solution} className="reveal-body" />
        </div>
      )}
    </article>
  );
}

// ---------------------------------------------------------------
// APP
// ---------------------------------------------------------------
export default function AppliedMathProblemBank() {
  useMathJaxLoader();
  const [problemSet, setProblemSet] = useState(() => sampleSet(BANK, SET_SIZE));
  const [solved, setSolved] = useState({});
  const [topicFilter, setTopicFilter] = useState("all");
  const [setVersion, setSetVersion] = useState(1);

  const visible = useMemo(
    () => (topicFilter === "all" ? problemSet : problemSet.filter(p => p.topic === topicFilter)),
    [problemSet, topicFilter]
  );

  const numbering = useMemo(() => {
    const map = {};
    problemSet.forEach((p, i) => { map[p.id] = i + 1; });
    return map;
  }, [problemSet]);

  const solvedCount = problemSet.filter(p => solved[p.id]).length;

  const newSet = () => {
    setProblemSet(sampleSet(BANK, SET_SIZE));
    setSetVersion(v => v + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const topicCounts = useMemo(() => {
    const c = {};
    problemSet.forEach(p => { c[p.topic] = (c[p.topic] || 0) + 1; });
    return c;
  }, [problemSet]);

  return (
    <div className="page">
      <style>{CSS}</style>
      <div className="spine" aria-hidden="true" />
      <div className="content">
        <header className="masthead">
          <div className="masthead-eyebrow">Problem set {setVersion} &middot; drawn from a bank of {BANK.length}</div>
          <h1 className="masthead-title">Applied Mathematical Methods</h1>
          <p className="masthead-sub">
            Fifty problems, ordered from undergraduate foundations to graduate methods &mdash; preparation
            for a masters course in applied mathematics. Difficulty is marked from <span className="int-mark">&#8747;</span> (warm-up)
            to <span className="int-mark">&#8747;&#8747;&#8747;&#8747;&#8747;</span> (qualifier level). Work the problem before opening
            the hint; work the hint before opening the solution.
          </p>
        </header>

        <nav className="toolbar">
          <div className="chips" role="tablist" aria-label="Filter by topic">
            <button className={"chip" + (topicFilter === "all" ? " chip-on" : "")} onClick={() => setTopicFilter("all")}>
              All ({problemSet.length})
            </button>
            {Object.entries(TOPICS).map(([key, name]) => (
              <button key={key} className={"chip" + (topicFilter === key ? " chip-on" : "")} onClick={() => setTopicFilter(key)}>
                {name} ({topicCounts[key] || 0})
              </button>
            ))}
          </div>
          <div className="toolbar-right">
            <div className="progress" aria-label={solvedCount + " of " + problemSet.length + " solved"}>
              <div className="progress-track"><div className="progress-fill" style={{ width: (100 * solvedCount / problemSet.length) + "%" }} /></div>
              <span className="progress-text">{solvedCount} / {problemSet.length} solved</span>
            </div>
            <button className="btn btn-new" onClick={newSet}>Generate new set</button>
          </div>
        </nav>

        <main>
          {PARTS.map(part => {
            const group = visible.filter(p => part.test(p.diff));
            if (!group.length) return null;
            return (
              <section key={part.label} className="part">
                <div className="part-head">
                  <span className="part-label">{part.label}</span>
                  <h2 className="part-name">{part.name}</h2>
                  <span className="part-range">{part.range}</span>
                </div>
                {group.map(p => (
                  <ProblemCard
                    key={p.id + "-" + setVersion}
                    problem={p}
                    number={numbering[p.id]}
                    solved={!!solved[p.id]}
                    onToggleSolved={() => setSolved(s => ({ ...s, [p.id]: !s[p.id] }))}
                  />
                ))}
              </section>
            );
          })}
        </main>

        <footer className="colophon">
          Topics span calculus &amp; vector calculus, linear algebra, ODEs, complex analysis, Fourier analysis
          &amp; transforms, and PDEs. &ldquo;Generate new set&rdquo; draws a fresh stratified sample from the full bank,
          keeping the same difficulty gradient. Progress applies to the current session.
        </footer>
      </div>
    </div>
  );
}

const CSS = String.raw`
  .page {
    --ink: #1c2a3a;
    --ink-soft: #54616f;
    --paper: #fbf9f4;
    --card: #ffffff;
    --line: #e3ddd0;
    --gold: #e8b50a;
    --gold-deep: #9a7400;
    --green: #2f7d5b;
    --hint-bg: #faf4e2;
    --sol-bg: #f2f6f3;
    min-height: 100vh;
    background: var(--paper);
    color: var(--ink);
    font-family: 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif;
    line-height: 1.55;
    position: relative;
  }
  .spine {
    position: fixed; top: 0; left: 0; bottom: 0; width: 12px;
    background: linear-gradient(180deg, var(--gold) 0%, #d9a404 100%);
    z-index: 5;
  }
  .content { max-width: 780px; margin: 0 auto; padding: 56px 28px 80px 40px; }

  .masthead { border-bottom: 3px double var(--line); padding-bottom: 28px; margin-bottom: 8px; }
  .masthead-eyebrow {
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--gold-deep); margin-bottom: 14px; font-weight: 600;
  }
  .masthead-title { font-size: clamp(30px, 5vw, 44px); line-height: 1.08; margin: 0 0 14px; font-weight: 600; letter-spacing: -0.01em; }
  .masthead-sub { color: var(--ink-soft); font-size: 16.5px; max-width: 62ch; margin: 0; }
  .int-mark { color: var(--gold-deep); font-size: 1.1em; }

  .toolbar {
    position: sticky; top: 0; z-index: 4;
    background: color-mix(in srgb, var(--paper) 92%, transparent);
    backdrop-filter: blur(6px);
    padding: 14px 0 12px; border-bottom: 1px solid var(--line);
    display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between;
  }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12.5px;
    padding: 5px 11px; border-radius: 999px; border: 1px solid var(--line);
    background: var(--card); color: var(--ink-soft); cursor: pointer;
  }
  .chip:hover { border-color: var(--gold-deep); color: var(--ink); }
  .chip-on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .toolbar-right { display: flex; gap: 14px; align-items: center; }
  .progress { display: flex; align-items: center; gap: 8px; }
  .progress-track { width: 90px; height: 6px; border-radius: 3px; background: var(--line); overflow: hidden; }
  .progress-fill { height: 100%; background: var(--green); transition: width 0.3s ease; }
  .progress-text { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px; color: var(--ink-soft); white-space: nowrap; }

  .part { margin-top: 44px; }
  .part-head { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; border-bottom: 1px solid var(--line); padding-bottom: 10px; margin-bottom: 20px; }
  .part-label { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold-deep); font-weight: 700; }
  .part-name { font-size: 24px; margin: 0; font-weight: 600; }
  .part-range { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px; color: var(--ink-soft); margin-left: auto; }

  .card { background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 22px 24px 18px; margin-bottom: 18px; transition: opacity 0.2s; }
  .card-solved { border-left: 4px solid var(--green); }
  .card-solved .card-title, .card-solved .statement { opacity: 0.62; }
  .card-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 6px; }
  .card-id { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; }
  .card-number { font-family: ui-sans-serif, system-ui, sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; }
  .card-topic { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11.5px; color: var(--ink-soft); letter-spacing: 0.04em; text-transform: uppercase; }
  .card-meta { display: flex; align-items: baseline; gap: 8px; }
  .diff { font-size: 17px; letter-spacing: 1px; line-height: 1; }
  .diff-on { color: var(--gold-deep); }
  .diff-off { color: var(--line); }
  .diff-name { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; color: var(--ink-soft); }
  .card-title { font-size: 19px; margin: 2px 0 10px; font-weight: 600; font-style: italic; }
  .statement { font-size: 16.5px; line-height: 1.9; }

  .card-actions { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
  .btn {
    font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; font-weight: 600;
    padding: 7px 14px; border-radius: 5px; border: 1px solid var(--line);
    background: var(--card); color: var(--ink); cursor: pointer;
  }
  .btn:hover { border-color: var(--ink); }
  .btn:focus-visible, .chip:focus-visible { outline: 2px solid var(--gold-deep); outline-offset: 2px; }
  .btn-active { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .btn-solve { margin-left: auto; color: var(--green); border-color: #cfe0d7; }
  .btn-solve:hover { border-color: var(--green); }
  .btn-solved { background: var(--green); color: #fff; border-color: var(--green); }
  .btn-new { background: var(--gold); border-color: var(--gold); color: #3a2e00; }
  .btn-new:hover { background: #f0c020; border-color: var(--gold-deep); }

  .reveal { margin-top: 14px; border-radius: 5px; padding: 14px 18px; font-size: 15.5px; }
  .reveal-body { line-height: 1.9; }
  .reveal-hint { background: var(--hint-bg); border-left: 3px solid var(--gold); }
  .reveal-solution { background: var(--sol-bg); border-left: 3px solid var(--green); }
  .reveal-label {
    font-family: ui-sans-serif, system-ui, sans-serif; font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 6px;
  }
  .reveal-body mjx-container[display="true"] { overflow-x: auto; overflow-y: hidden; max-width: 100%; }
  .statement mjx-container[display="true"] { overflow-x: auto; overflow-y: hidden; max-width: 100%; }

  .colophon { margin-top: 56px; padding-top: 18px; border-top: 3px double var(--line); font-size: 13.5px; color: var(--ink-soft); font-style: italic; }

  @media (max-width: 640px) {
    .content { padding: 40px 16px 60px 26px; }
    .spine { width: 8px; }
    .btn-solve { margin-left: 0; }
    .toolbar-right { width: 100%; justify-content: space-between; }
  }
  @media (prefers-reduced-motion: reduce) {
    .progress-fill { transition: none; }
  }
`;
