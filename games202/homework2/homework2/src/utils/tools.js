function getRotationPrecomputeL(precompute_L, rotationMatrix){

	let rotationMatrix_invert = mat4.create();
	mat4.invert(rotationMatrix_invert, rotationMatrix);
	let r = mat4Matrix2mathMatrix(rotationMatrix_invert);

	let shRotationMatrix3by3 = computeSquareMatrix_3by3(r);
	let shRotationMatrix5by5 = computeSquareMatrix_5by5(r);

	let res = [];
	for(let i = 0;i < 9;++i)
	{
		res[i] = [];
	}
	for(let i = 0;i < 3;++i)
	{
		let shRotate3 = math.multiply([precompute_L[1][i],precompute_L[2][i],precompute_L[3][i]],shRotationMatrix3by3);
		let shRotate5 = math.multiply([precompute_L[4][i],precompute_L[5][i],precompute_L[6][i],
										precompute_L[7][i],precompute_L[8][i]],shRotationMatrix5by5);

		res[0][i] = precompute_L[0][i];
		res[1][i] = shRotate3._data[0];
		res[2][i] = shRotate3._data[1];
		res[3][i] = shRotate3._data[2];
		res[4][i] = shRotate5._data[0];
		res[5][i] = shRotate5._data[1];
		res[6][i] = shRotate5._data[2];
		res[7][i] = shRotate5._data[3];
		res[8][i] = shRotate5._data[4];
	}
	return res;
	
}

function computeSquareMatrix_3by3(rotationMatrix){ // 计算方阵SA(-1) 3*3 
	
	// 1、pick ni - {ni}
	let n1 = [1, 0, 0, 0]; let n2 = [0, 0, 1, 0]; let n3 = [0, 1, 0, 0];

	// 2、{P(ni)} - A  A_inverse
	
	let n1_sh = SHEval(n1[0],n1[1],n1[2],3);
	let n2_sh = SHEval(n2[0],n2[1],n2[2],3);
	let n3_sh = SHEval(n3[0],n3[1],n3[2],3);
	
	let A = math.matrix([
		[n1_sh[1],n2_sh[1],n3_sh[1]],
		[n1_sh[2],n2_sh[2],n3_sh[2]],
		[n1_sh[3],n2_sh[3],n3_sh[3]]
	]);

	let A_inverse = math.inv(A);

	// 3、用 R 旋转 ni - {R(ni)}
	let n1_rotation = math.multiply(rotationMatrix,n1);
	let n2_rotation = math.multiply(rotationMatrix,n2);
	let n3_rotation = math.multiply(rotationMatrix,n3);

	// 4、R(ni) SH投影 - S
	let n1_sh_rotation = SHEval(n1_rotation[0],n1_rotation[1],n1_rotation[2],3);
	let n2_sh_rotation = SHEval(n2_rotation[0],n2_rotation[1],n2_rotation[2],3);
	let n3_sh_rotation = SHEval(n3_rotation[0],n3_rotation[1],n3_rotation[2],3);

	let S = math.matrix([
		[n1_sh_rotation[1],n2_sh_rotation[1],n3_sh_rotation[1]],
		[n1_sh_rotation[2],n2_sh_rotation[2],n3_sh_rotation[2]],
		[n1_sh_rotation[3],n2_sh_rotation[3],n3_sh_rotation[3]]
	]);
	
	// 5、S*A_inverse

	return math.multiply(S, A_inverse)
}

function computeSquareMatrix_5by5(rotationMatrix){ // 计算方阵SA(-1) 5*5
	
	// 1、pick ni - {ni}
	let k = 1 / math.sqrt(2);
	let n1 = [1, 0, 0, 0]; let n2 = [0, 0, 1, 0]; let n3 = [k, k, 0, 0]; 
	let n4 = [k, 0, k, 0]; let n5 = [0, k, k, 0];

	// 2、{P(ni)} - A  A_inverse
	let n1_sh = SHEval(n1[0],n1[1],n1[2],3);
	let n2_sh = SHEval(n2[0],n2[1],n2[2],3);
	let n3_sh = SHEval(n3[0],n3[1],n3[2],3);
	let n4_sh = SHEval(n4[0],n4[1],n4[2],3);
	let n5_sh = SHEval(n5[0],n5[1],n5[2],3);

	let A = math.matrix([
		[n1_sh[4],n2_sh[4],n3_sh[4],n4_sh[4],n5_sh[4]],
		[n1_sh[5],n2_sh[5],n3_sh[5],n4_sh[5],n5_sh[5]],
		[n1_sh[6],n2_sh[6],n3_sh[6],n4_sh[6],n5_sh[6]],
		[n1_sh[7],n2_sh[7],n3_sh[7],n4_sh[7],n5_sh[7]],
		[n1_sh[8],n2_sh[8],n3_sh[8],n4_sh[8],n5_sh[8]],
	]);

	let A_inverse = math.inv(A);
	// 3、用 R 旋转 ni - {R(ni)}

	let n1_rotation = math.multiply(rotationMatrix,n1);
	let n2_rotation = math.multiply(rotationMatrix,n2);
	let n3_rotation = math.multiply(rotationMatrix,n3);
	let n4_rotation = math.multiply(rotationMatrix,n4);
	let n5_rotation = math.multiply(rotationMatrix,n5);
	// 4、R(ni) SH投影 - S
	let n1_sh_rotation = SHEval(n1_rotation[0],n1_rotation[1],n1_rotation[2],3);
	let n2_sh_rotation = SHEval(n2_rotation[0],n2_rotation[1],n2_rotation[2],3);
	let n3_sh_rotation = SHEval(n3_rotation[0],n3_rotation[1],n3_rotation[2],3);
	let n4_sh_rotation = SHEval(n4_rotation[0],n4_rotation[1],n4_rotation[2],3);
	let n5_sh_rotation = SHEval(n5_rotation[0],n5_rotation[1],n5_rotation[2],3);
	// 5、S*A_inverse

	let S = math.matrix([
		[n1_sh_rotation[4],n2_sh_rotation[4],n3_sh_rotation[4],n4_sh_rotation[4],n5_sh_rotation[4]],
		[n1_sh_rotation[5],n2_sh_rotation[5],n3_sh_rotation[5],n4_sh_rotation[5],n5_sh_rotation[5]],
		[n1_sh_rotation[6],n2_sh_rotation[6],n3_sh_rotation[6],n4_sh_rotation[6],n5_sh_rotation[6]],
		[n1_sh_rotation[7],n2_sh_rotation[7],n3_sh_rotation[7],n4_sh_rotation[7],n5_sh_rotation[7]],
		[n1_sh_rotation[8],n2_sh_rotation[8],n3_sh_rotation[8],n4_sh_rotation[8],n5_sh_rotation[8]]
	]);

	return math.multiply(S,A_inverse)
}

function mat4Matrix2mathMatrix(rotationMatrix){

	let mathMatrix = [];
	for(let i = 0; i < 4; i++){
		let r = [];
		for(let j = 0; j < 4; j++){
			r.push(rotationMatrix[i*4+j]);
		}
		mathMatrix.push(r);
	}
	return math.transpose(mathMatrix)

}

function getMat3ValueFromRGB(precomputeL){

    let colorMat3 = [];
    for(var i = 0; i<3; i++){
        colorMat3[i] = mat3.fromValues( precomputeL[0][i], precomputeL[1][i], precomputeL[2][i],
										precomputeL[3][i], precomputeL[4][i], precomputeL[5][i],
										precomputeL[6][i], precomputeL[7][i], precomputeL[8][i] ); 
	}
    return colorMat3;
}

